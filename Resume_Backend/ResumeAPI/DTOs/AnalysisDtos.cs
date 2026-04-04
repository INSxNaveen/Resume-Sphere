using System.Text.Json.Serialization;

namespace ResumeAPI.DTOs;

public class RunAnalysisRequestDto
{
    public Guid ResumeId { get; set; }
}

public class AnalysisResultDto
{
    public Guid AnalysisId { get; set; }
    
    public List<string> CurrentSkills { get; set; } = new();
    public List<EligibleJobDto> EligibleJobs { get; set; } = new();
    public List<ImprovementSuggestionDto> ImprovementSuggestions { get; set; } = new();
    public List<UnlockedOpportunityDto> UnlockedOpportunities { get; set; } = new();

    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid ResumeId { get; set; }
}

public class EligibleJobDto
{
    public string Title { get; set; } = string.Empty;
    public string FitReason { get; set; } = string.Empty;
    public int MatchScore { get; set; }
    public List<string> MissingSkills { get; set; } = new();
}

public class ImprovementSuggestionDto
{
    public string Skill { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
}

public class UnlockedOpportunityDto
{
    public string Title { get; set; } = string.Empty;
    public string WhyUnlocked { get; set; } = string.Empty;
    public List<string> RequiredAddedSkills { get; set; } = new();
}

public class AnalysisHistoryDto
{
    public Guid AnalysisId { get; set; }
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("overallScore")]
    public int OverallScore { get; set; }

    [JsonPropertyName("roleTitle")]
    public string RoleTitle { get; set; } = string.Empty;

    [JsonPropertyName("companyName")]
    public string CompanyName { get; set; } = string.Empty;

    [JsonPropertyName("matchedSkillsCount")]
    public int MatchedSkillsCount { get; set; }

    [JsonPropertyName("missingSkillsCount")]
    public int MissingSkillsCount { get; set; }
}
