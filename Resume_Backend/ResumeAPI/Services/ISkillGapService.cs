using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface ISkillGapService
{
    Task<SkillGapResult> GetGapAsync(Guid resumeId, int jobId);
}
