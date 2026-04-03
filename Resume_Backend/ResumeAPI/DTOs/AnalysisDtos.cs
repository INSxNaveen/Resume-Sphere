using System.Text.Json.Serialization;

namespace ResumeAPI.DTOs;

public class RunAnalysisRequestDto
{
    public Guid ResumeId { get; set; }
    public string JobDescriptionText { get; set; } = string.Empty;
    public string RoleTitle { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? ExperienceLevel { get; set; }
}

public class AnalysisResultDto
{
    public Guid AnalysisId { get; set; }
    public decimal OverallScore { get; set; }
    public List<string> MatchedSkills { get; set; } = new();
    public List<MissingSkillDetail> MissingSkills { get; set; } = new();
    public List<MissingKeywordDetail> MissingKeywords { get; set; } = new();
    public ScoreBreakdownDto ScoreBreakdown { get; set; } = new();
    public List<string> DeductionReasons { get; set; } = new();
    public List<SuggestionDetail> Suggestions { get; set; } = new();
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid ResumeId { get; set; }
    public Guid JobDescriptionId { get; set; }
}

/// <summary>6-category weighted score breakdown matching the AI service output.</summary>
public class ScoreBreakdownDto
{
    public decimal RequiredSkillsScore { get; set; }
    public decimal PreferredSkillsScore { get; set; }
    public decimal AtsKeywordsScore { get; set; }
    public decimal ExperienceRelevanceScore { get; set; }
    public decimal EducationScore { get; set; }
    public decimal ResumeQualityScore { get; set; }
}

public class MissingKeywordDetail
{
    public string Keyword { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
}

public class SuggestionDetail
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AnalysisHistoryDto
{
    public Guid AnalysisId { get; set; }
    public string RoleTitle { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public decimal OverallScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public int MatchedSkillsCount { get; set; }
    public int MissingSkillsCount { get; set; }
}
