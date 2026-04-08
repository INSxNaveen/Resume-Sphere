using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IAnalysisService
{
    Task<AnalysisResultDto> RunAnalysisAsync(Guid userId, RunAnalysisRequestDto request);
    Task<AnalysisResultDto?> GetAnalysisAsync(Guid userId, Guid analysisId);
    Task<List<AnalysisHistoryDto>> GetAnalysisHistoryAsync(Guid userId);
    Task<bool> DeleteAnalysisAsync(Guid userId, Guid analysisId);
}
