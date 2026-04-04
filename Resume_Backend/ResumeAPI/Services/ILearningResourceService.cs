using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface ILearningResourceService
{
    Task<ResourceResult> GetResourcesAsync(string skill);
}
