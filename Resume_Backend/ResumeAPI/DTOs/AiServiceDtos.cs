using System.Text.Json.Serialization;

namespace ResumeAPI.DTOs;

// ═══════════════════════════════════════════════════════════════════════════════
// DTOs for communication with the Python FastAPI AI service
// ═══════════════════════════════════════════════════════════════════════════════

/// <summary>Response from POST /analyze on the AI service.</summary>
public class AiAnalysisResponseDto
{
    [JsonPropertyName("currentSkills")]
    public List<string> CurrentSkills { get; set; } = new();

    [JsonPropertyName("eligibleJobs")]
    public List<AiEligibleJobDto> EligibleJobs { get; set; } = new();

    [JsonPropertyName("improvementSuggestions")]
    public List<AiImprovementSuggestionDto> ImprovementSuggestions { get; set; } = new();

    [JsonPropertyName("unlockedOpportunities")]
    public List<AiUnlockedOpportunityDto> UnlockedOpportunities { get; set; } = new();
}

public class AiEligibleJobDto
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("fitReason")]
    public string FitReason { get; set; } = string.Empty;

    [JsonPropertyName("matchScore")]
    public int MatchScore { get; set; }

    [JsonPropertyName("missingSkills")]
    public List<string> MissingSkills { get; set; } = new();
}

public class AiImprovementSuggestionDto
{
    [JsonPropertyName("skill")]
    public string Skill { get; set; } = string.Empty;

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = string.Empty;

    [JsonPropertyName("priority")]
    public string Priority { get; set; } = string.Empty;
}

public class AiUnlockedOpportunityDto
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("whyUnlocked")]
    public string WhyUnlocked { get; set; } = string.Empty;

    [JsonPropertyName("requiredAddedSkills")]
    public List<string> RequiredAddedSkills { get; set; } = new();
}
