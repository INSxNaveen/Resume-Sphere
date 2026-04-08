using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResumeController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IResumeParserService _parser;
    private readonly ISkillExtractorService _extractor;
    private readonly IResumeGenerationService _generationService;
    private readonly IUploadModerationService _moderationService;

    public ResumeController(
        AppDbContext db, 
        IResumeParserService parser, 
        ISkillExtractorService extractor, 
        IResumeGenerationService generationService,
        IUploadModerationService moderationService)
    {
        _db = db;
        _parser = parser;
        _extractor = extractor;
        _generationService = generationService;
        _moderationService = moderationService;
    }

    /// <summary>Upload a resume (PDF or DOCX) and extract skills from it.</summary>
    /// <remarks>DATA RULE 2: Uses the authenticated JWT user ID — no fake fallback user.</remarks>
    [HttpPost("upload")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResumeUploadResponse>> Upload(IFormFile file)
    {
        // DATA RULE 2 — get UserId from JWT, never from query param
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { error = "Valid authentication token required." });

        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file was uploaded." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "File size exceeds the 5MB limit." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf" && ext != ".docx")
            return BadRequest(new { error = "Only PDF and DOCX files are supported." });

        string rawText;
        try
        {
            rawText = await _parser.ExtractTextAsync(file);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = $"Failed to parse the file: {ex.Message}" });
        }

        // Add user validation & IP reading
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            return Unauthorized();
            
        if (user.IsSuspended)
            return StatusCode(403, new { action = "force_logout", error = "Your account has been temporarily suspended due to repeated policy violations." });
            
        // Check Device/IP if necessary (using a simple check for example context)
        string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        // Invoke Moderation Layer
        var moderationResult = await _moderationService.EvaluateAsync(file, rawText);
        
        var modEvent = new UploadModerationEvent
        {
            UserId = userId,
            FileName = file.FileName,
            ContentType = file.ContentType,
            Decision = moderationResult.Decision,
            Reason = moderationResult.Reason,
            RiskScoreImpact = moderationResult.RecommendedRiskIncrement,
            IpAddress = ipAddress,
            CreatedAt = DateTime.UtcNow
        };
        _db.UploadModerationEvents.Add(modEvent);
        
        if (moderationResult.RecommendedRiskIncrement > 0)
        {
            user.AbuseRiskScore += moderationResult.RecommendedRiskIncrement;
            if (user.AbuseRiskScore > 100)
            {
                user.IsSuspended = true;
                user.SuspendedUntil = DateTime.UtcNow.AddDays(7);
            }
        }

        await _db.SaveChangesAsync();

        if (!moderationResult.IsAllowed)
        {
            if (user.IsSuspended)
            {
                return StatusCode(403, new { action = "force_logout", error = "Your account has been temporarily suspended due to repeated policy violations." });
            }
            
            return BadRequest(new { action = "blocked", error = $"Upload rejected: {moderationResult.Reason}" });
        }

        var resume = new Resume
        {
            UserId         = userId,
            FileName       = file.FileName,
            FileType       = ext.TrimStart('.').ToUpperInvariant(), // "PDF" or "DOCX"
            RawText        = rawText,
            NormalizedText = rawText.Trim(), // basic normalization; AI service handles deep cleanup
            UploadedAt     = DateTime.UtcNow
        };

        _db.Resumes.Add(resume);
        await _db.SaveChangesAsync();

        var skills = await _extractor.ExtractSkillsAsync(rawText);

        return Ok(new ResumeUploadResponse
        {
            ResumeId        = resume.Id,
            UserId          = userId,
            FileName        = resume.FileName,
            ExtractedSkills = skills
        });
    }

    /// <summary>Get extracted skills for an existing resume by ID.</summary>
    [HttpGet("{id:guid}/skills")]
    [Authorize]
    public async Task<ActionResult<List<string>>> GetSkills(Guid id)
    {
        var resume = await _db.Resumes.FindAsync(id);
        if (resume is null)
            return NotFound(new { error = $"Resume with ID {id} not found." });

        var skills = await _extractor.ExtractSkillsAsync(resume.RawText);
        return Ok(skills);
    }

    /// <summary>Get all resumes belonging to the authenticated user.</summary>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var resumes = await _db.Resumes
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .Select(r => new { r.Id, r.UserId, r.FileName, r.FileType, r.UploadedAt })
            .ToListAsync();

        return Ok(resumes);
    }

    /// <summary>Generate a tailored resume based on an analysis.</summary>
    [HttpPost("generate-tailored")]
    [Authorize]
    public async Task<ActionResult<ResumeGenerationResultDto>> GenerateTailored([FromBody] GenerateTailoredResumeRequestDto request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        try
        {
            var result = await _generationService.GenerateTailoredResumeAsync(userId, request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Get a generated tailored resume.</summary>
    [HttpGet("generated/{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ResumeGenerationResultDto>> GetGenerated(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _generationService.GetGeneratedResumeAsync(userId, id);
        if (result == null) return NotFound(new { error = "Generated resume not found." });
        return Ok(result);
    }

    /// <summary>Get the complete profile of the user's most recent active resume.</summary>
    [HttpGet("active-profile")]
    [Authorize]
    public async Task<ActionResult<ResumeProfileDto>> GetActiveProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound(new { error = "User not found." });

        var lastResume = await _db.Resumes
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.UploadedAt)
            .FirstOrDefaultAsync();

        if (lastResume == null)
            return NotFound(new { error = "No resume found for this user." });

        var skills = await _db.ResumeExtractedSkills
            .Where(s => s.ResumeId == lastResume.Id)
            .Select(s => s.SkillName)
            .Distinct()
            .ToListAsync();

        var profile = new ResumeProfileDto
        {
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            ResumeText = lastResume.NormalizedText,
            Skills = skills,
            ExperienceSummary = lastResume.NormalizedText.Length > 500 
                ? lastResume.NormalizedText.Substring(0, 500) 
                : lastResume.NormalizedText,
            ResumeId = lastResume.Id
        };

        return Ok(profile);
    }
}
