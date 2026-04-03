using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJobMatchService _matchService;
    private readonly ISkillExtractorService _extractor;

    public JobsController(AppDbContext db, IJobMatchService matchService, ISkillExtractorService extractor)
    {
        _db           = db;
        _matchService  = matchService;
        _extractor    = extractor;
    }

    /// <summary>Match resume skills against all jobs and return ranked results.</summary>
    [HttpPost("match")]
    public async Task<ActionResult<List<JobMatchResult>>> Match([FromBody] JobMatchRequest request)
    {
        var resume = await _db.Resumes.FindAsync(request.ResumeId);
        if (resume is null)
            return NotFound(new { error = $"Resume with ID {request.ResumeId} not found." });

        var skills  = await _extractor.ExtractSkillsAsync(resume.RawText);
        var results = await _matchService.MatchAsync(skills, request.TopN > 0 ? request.TopN : 10);

        if (results.Count == 0)
            return NotFound(new { error = "No matching jobs found for your current skill profile." });

        return Ok(results);
    }

    /// <summary>Get all available jobs in the dataset.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var jobs = await _db.Jobs
            .AsNoTracking()
            .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.Company,
                j.Description,
                RequiredSkills = j.JobSkills.Select(js => js.Skill!.Name).ToList()
            })
            .ToListAsync();

        return Ok(jobs);
    }
}
