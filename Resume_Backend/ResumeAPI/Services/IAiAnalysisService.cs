using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

/// <summary>
/// Communicates with the Python FastAPI AI service for real JD-driven analysis
/// and truthful resume generation.
/// </summary>
public interface IAiAnalysisService
{
    /// <summary>Sends resume + JD text to the AI service and returns structured analysis.</summary>
    Task<AiAnalysisResponseDto?> AnalyzeAsync(string resumeText, string jdText, string roleTitle, string companyName, string experienceLevel);

    /// <summary>Sends resume + JD text to the AI service for truthful resume generation.</summary>
    Task<AiResumeGenerationResponseDto?> GenerateResumeAsync(string resumeText, string jdText, string roleTitle, string companyName, string experienceLevel);

    /// <summary>Check if the AI service is reachable.</summary>
    Task<bool> IsHealthyAsync();
}
