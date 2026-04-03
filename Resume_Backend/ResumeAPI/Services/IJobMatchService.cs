using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IJobMatchService
{
    Task<List<JobMatchResult>> MatchAsync(List<string> resumeSkills, int topN = 10);
}
