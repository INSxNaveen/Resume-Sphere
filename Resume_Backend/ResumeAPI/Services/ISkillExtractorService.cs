using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface ISkillExtractorService
{
    Task<List<string>> ExtractSkillsAsync(string resumeText);
}
