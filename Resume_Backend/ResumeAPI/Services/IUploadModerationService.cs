using Microsoft.AspNetCore.Http;
using ResumeAPI.Models;

namespace ResumeAPI.Services;

public class ModerationResult
{
    public bool IsAllowed { get; set; } = true;
    public string Decision { get; set; } = "Allowed"; // Allowed, Suspicious, Blocked
    public string Reason { get; set; } = string.Empty;
    public int RecommendedRiskIncrement { get; set; } = 0;
}

public interface IUploadModerationService
{
    Task<ModerationResult> EvaluateAsync(IFormFile file, string extractedText);
}
