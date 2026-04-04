using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IResumeGenerationService
{
    Task<ResumeGenerationResultDto> GenerateTailoredResumeAsync(Guid userId, GenerateTailoredResumeRequestDto request);
    Task<ResumeGenerationResultDto?> GetGeneratedResumeAsync(Guid userId, Guid generatedResumeId);
}
