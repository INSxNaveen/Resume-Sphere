using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Helpers;

namespace ResumeAPI.Services;

public class JobMatchService : IJobMatchService
{
    private readonly AppDbContext _db;

    public JobMatchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<JobMatchResult>> MatchAsync(List<string> resumeSkills, int topN = 3)
    {
        var normalizedResume = new HashSet<string>(resumeSkills, StringComparer.OrdinalIgnoreCase);

        var jobs = await _db.Jobs
            .AsNoTracking()
            .Include(j => j.JobSkills)
                .ThenInclude(js => js.Skill)
            .ToListAsync();

        var results = new List<JobMatchResult>();

        foreach (var job in jobs)
        {
            var coreReq = job.JobSkills.Where(js => js.IsCore).Select(js => js.Skill!.Name).ToList();
            var optReq  = job.JobSkills.Where(js => !js.IsCore).Select(js => js.Skill!.Name).ToList();

            var coreMatched = coreReq.Where(r => normalizedResume.Contains(r)).ToList();
            var optMatched  = optReq.Where(r => normalizedResume.Contains(r)).ToList();

            var coreMissing = coreReq.Except(coreMatched).ToList();
            var optMissing = optReq.Except(optMatched).ToList();

            double coreScore = coreReq.Count == 0 ? 100 : (double)coreMatched.Count / coreReq.Count * 100;
            double optScore  = optReq.Count == 0 ? 100 : (double)optMatched.Count / optReq.Count * 100;

            double finalScore = 0;
            if (coreReq.Count > 0 && optReq.Count > 0)
                finalScore = (coreScore * 0.70) + (optScore * 0.30);
            else if (coreReq.Count > 0)
                finalScore = coreScore;
            else if (optReq.Count > 0)
                finalScore = optScore;

            string explanation = $"You matched {coreMatched.Count}/{coreReq.Count} Core skills " +
                                 $"and {optMatched.Count}/{optReq.Count} Optional skills.";

            results.Add(new JobMatchResult
            {
                JobId         = job.Id,
                Title         = job.Title,
                Company       = job.Company,
                Description   = job.Description,
                RequiredSkills = job.JobSkills.Select(js => js.Skill!.Name).ToList(),
                MatchedSkills  = coreMatched.Concat(optMatched).ToList(),
                MissingSkills  = coreMissing.Concat(optMissing)
                                     .Select(skill => SkillEnricher.Enrich(skill, job.Title))
                                     .ToList(),
                MatchScore     = Math.Round(finalScore, 2),
                MatchExplanation = explanation
            });
        }

        return results
            .OrderByDescending(r => r.MatchScore)
            .Take(topN)
            .ToList();
    }
}
