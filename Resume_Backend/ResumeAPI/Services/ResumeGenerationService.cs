using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;
using System.Text.Json;

namespace ResumeAPI.Services;

/// <summary>
/// Generates truthful ATS-optimized tailored resumes by calling the FastAPI AI service.
/// No fabrication of skills, experience, or achievements.
/// </summary>
public class ResumeGenerationService : IResumeGenerationService
{
    private readonly AppDbContext _context;
    private readonly IAiAnalysisService _aiService;
    private readonly ILogger<ResumeGenerationService> _logger;

    public ResumeGenerationService(AppDbContext context, IAiAnalysisService aiService, ILogger<ResumeGenerationService> logger)
    {
        _context = context;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<ResumeGenerationResultDto> GenerateTailoredResumeAsync(Guid userId, GenerateTailoredResumeRequestDto request)
    {
        var analysis = await _context.Analyses
            .Include(a => a.Resume)
            .Include(a => a.JobDescription)
            .FirstOrDefaultAsync(a => a.Id == request.AnalysisId && a.UserId == userId);

        if (analysis == null)
            throw new ArgumentException("Analysis not found or does not belong to the user.");

        if (analysis.Resume == null || analysis.JobDescription == null)
            throw new ArgumentException("Resume or job description data is missing for this analysis.");

        // Call the AI service for real resume generation
        var aiResult = await _aiService.GenerateResumeAsync(
            analysis.Resume.RawText,
            analysis.JobDescription.RawText,
            analysis.JobDescription.RoleTitle,
            analysis.JobDescription.CompanyName ?? "",
            analysis.JobDescription.ExperienceLevel ?? ""
        );

        string plainText;
        string contentJson;

        if (aiResult != null)
        {
            plainText = aiResult.PlainText;
            contentJson = JsonSerializer.Serialize(aiResult.ContentJson);
        }
        else
        {
            _logger.LogWarning("AI service unavailable for resume generation, using basic template");
            plainText = GenerateBasicTemplate(analysis);
            contentJson = "{}";
        }

        // Determine version number
        var existingCount = await _context.GeneratedResumes
            .CountAsync(g => g.AnalysisId == analysis.Id);

        var generated = new GeneratedResume
        {
            UserId = userId,
            AnalysisId = analysis.Id,
            RoleTitle = analysis.JobDescription.RoleTitle,
            ContentJson = contentJson,
            PlainText = plainText,
            GeneratedAt = DateTime.UtcNow,
            Version = existingCount + 1,
        };

        _context.GeneratedResumes.Add(generated);
        await _context.SaveChangesAsync();

        return new ResumeGenerationResultDto
        {
            GeneratedResumeId = generated.Id,
            AnalysisId = analysis.Id,
            TailoredContent = generated.PlainText,
            Status = "completed",
            CreatedAt = generated.GeneratedAt,
        };
    }

    public async Task<ResumeGenerationResultDto?> GetGeneratedResumeAsync(Guid userId, Guid generatedResumeId)
    {
        var generated = await _context.GeneratedResumes
            .Include(g => g.Analysis)
            .FirstOrDefaultAsync(g => g.Id == generatedResumeId && g.UserId == userId);

        if (generated == null) return null;

        return new ResumeGenerationResultDto
        {
            GeneratedResumeId = generated.Id,
            AnalysisId = generated.AnalysisId,
            TailoredContent = generated.PlainText,
            Status = "completed",
            CreatedAt = generated.GeneratedAt,
        };
    }

    /// <summary>Basic fallback when AI service is unavailable.</summary>
    private static string GenerateBasicTemplate(Analysis analysis)
    {
        var role = analysis.JobDescription?.RoleTitle ?? "Target Role";
        return $"═══ TAILORED RESUME FOR: {role} ═══\n\n" +
               "The AI resume generation service is temporarily unavailable.\n" +
               "Please try again later for a full ATS-optimized resume draft.\n\n" +
               $"Analysis Score: {analysis.OverallScore}%";
    }
}
