using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

/// <summary>
/// Communicates with the Python FastAPI AI service for resume-first analysis.
/// </summary>
public interface IAiAnalysisService
{
    Task<AiAnalysisResponseDto?> AnalyzeAsync(string resumeText);

    /// <summary>Check if the AI service is reachable.</summary>
    Task<bool> IsHealthyAsync();
}
