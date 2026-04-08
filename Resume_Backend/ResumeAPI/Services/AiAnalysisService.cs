using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

/// <summary>
/// Calls the Python FastAPI AI service for resume-first analysis.
/// Sends resume text and receives structured analysis results.
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

    public async Task<AiAnalysisResponseDto?> AnalyzeAsync(string resumeText)
    {
        var payload = new
        {
            resume_text = resumeText,
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
