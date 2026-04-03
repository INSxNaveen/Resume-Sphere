using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface ILearningPlanService
{
    Task<List<LearningPlanItemDto>> GetLearningPlanAsync(Guid userId, Guid analysisId);
}
