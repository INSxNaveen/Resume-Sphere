using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

/// <summary>
/// Calls the Python FastAPI AI service for real analysis and resume generation.
/// Replaces the legacy JobMatchService-based analysis flow.
/// </summary>
public class AiAnalysisService : IAiAnalysisService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AiAnalysisService> _logger;
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true,
    };

    public AiAnalysisService(HttpClient httpClient, ILogger<AiAnalysisService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<AiAnalysisResponseDto?> AnalyzeAsync(
        string resumeText, string jdText, string roleTitle,
        string companyName, string experienceLevel)
    {
        var payload = new
        {
            resume_text = resumeText,
            jd_text = jdText,
            role_title = roleTitle,
            company_name = companyName ?? "",
            experience_level = experienceLevel ?? "",
        };

        var json = JsonSerializer.Serialize(payload, JsonOpts);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync("/analyze", content);
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<AiAnalysisResponseDto>(body, JsonOpts);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to reach AI service at /analyze");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deserializing AI analysis response");
            return null;
        }
    }

    public async Task<AiResumeGenerationResponseDto?> GenerateResumeAsync(
        string resumeText, string jdText, string roleTitle,
        string companyName, string experienceLevel)
    {
        var payload = new
        {
            resume_text = resumeText,
            jd_text = jdText,
            role_title = roleTitle,
            company_name = companyName ?? "",
            experience_level = experienceLevel ?? "",
        };

        var json = JsonSerializer.Serialize(payload, JsonOpts);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync("/generate-resume", content);
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<AiResumeGenerationResponseDto>(body, JsonOpts);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to reach AI service at /generate-resume");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deserializing AI resume generation response");
            return null;
        }
    }

    public async Task<bool> IsHealthyAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/health");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
