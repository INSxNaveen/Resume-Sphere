using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Helpers;

namespace ResumeAPI.Services;

public class SkillGapService : ISkillGapService
{
    private readonly AppDbContext _db;
    private readonly ISkillExtractorService _skillExtractor;

    public SkillGapService(AppDbContext db, ISkillExtractorService skillExtractor)
    {
        _db = db;
        _skillExtractor = skillExtractor;
    }

    public async Task<SkillGapResult> GetGapAsync(Guid resumeId, int jobId)
    {
        var resume = await _db.Resumes.FindAsync(resumeId)
            ?? throw new KeyNotFoundException($"Resume with ID {resumeId} not found.");

        var job = await _db.Jobs
            .AsNoTracking()
            .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
            .FirstOrDefaultAsync(j => j.Id == jobId)
            ?? throw new KeyNotFoundException($"Job with ID {jobId} not found.");

        var resumeSkills = await _skillExtractor.ExtractSkillsAsync(resume.RawText);
        var resumeSkillsNorm = new HashSet<string>(resumeSkills, StringComparer.OrdinalIgnoreCase);

        var requiredSkills = job.JobSkills
            .Select(js => js.Skill!.Name)
            .ToList();

        var matched = requiredSkills
            .Where(r => resumeSkillsNorm.Contains(r))
            .ToList();

        var missing = requiredSkills
            .Where(r => !resumeSkillsNorm.Contains(r))
            .ToList();

        double score = requiredSkills.Count == 0
            ? 0
            : Math.Round((double)matched.Count / requiredSkills.Count * 100, 2);

        return new SkillGapResult
        {
            ResumeId      = resumeId,
            JobId         = jobId,
            JobTitle      = job.Title,
            Company       = job.Company,
            ResumeSkills  = resumeSkills,
            MatchedSkills = matched,
            MissingSkills = missing.Select(s => SkillEnricher.Enrich(s, job.Title)).ToList(),
            MatchScore    = score
        };
    }
}
