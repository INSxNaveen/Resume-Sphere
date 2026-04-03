using System.Text.Json.Serialization;

namespace ResumeAPI.DTOs;

// ═══════════════════════════════════════════════════════════════════════════════
// DTOs for communication with the Python FastAPI AI service
// ═══════════════════════════════════════════════════════════════════════════════

/// <summary>Response from POST /analyze on the AI service.</summary>
public class AiAnalysisResponseDto
{
    [JsonPropertyName("overall_score")]
    public decimal OverallScore { get; set; }

    [JsonPropertyName("score_breakdown")]
    public AiScoreBreakdownDto ScoreBreakdown { get; set; } = new();

    [JsonPropertyName("score_weights")]
    public Dictionary<string, int> ScoreWeights { get; set; } = new();

    [JsonPropertyName("deduction_reasons")]
    public List<string> DeductionReasons { get; set; } = new();

    [JsonPropertyName("matched_skills")]
    public List<string> MatchedSkills { get; set; } = new();

    [JsonPropertyName("missing_skills")]
    public List<AiMissingSkillDto> MissingSkills { get; set; } = new();

    [JsonPropertyName("missing_keywords")]
    public List<AiMissingKeywordDto> MissingKeywords { get; set; } = new();

    [JsonPropertyName("matched_keywords")]
    public List<string> MatchedKeywords { get; set; } = new();

    [JsonPropertyName("suggestions")]
    public List<AiSuggestionDto> Suggestions { get; set; } = new();

    [JsonPropertyName("learning_plan")]
    public List<AiLearningPlanItemDto> LearningPlan { get; set; } = new();

    [JsonPropertyName("resume_entities")]
    public AiResumeEntitiesDto ResumeEntities { get; set; } = new();

    [JsonPropertyName("jd_entities")]
    public AiJdEntitiesDto JdEntities { get; set; } = new();
}

public class AiScoreBreakdownDto
{
    [JsonPropertyName("required_skills_score")]
    public decimal RequiredSkillsScore { get; set; }

    [JsonPropertyName("preferred_skills_score")]
    public decimal PreferredSkillsScore { get; set; }

    [JsonPropertyName("ats_keywords_score")]
    public decimal AtsKeywordsScore { get; set; }

    [JsonPropertyName("experience_relevance_score")]
    public decimal ExperienceRelevanceScore { get; set; }

    [JsonPropertyName("education_score")]
    public decimal EducationScore { get; set; }

    [JsonPropertyName("resume_quality_score")]
    public decimal ResumeQualityScore { get; set; }
}

public class AiMissingSkillDto
{
    [JsonPropertyName("skill_name")]
    public string SkillName { get; set; } = string.Empty;

    [JsonPropertyName("priority")]
    public string Priority { get; set; } = "medium";

    [JsonPropertyName("category")]
    public string Category { get; set; } = "required";

    [JsonPropertyName("why_it_matters")]
    public string WhyItMatters { get; set; } = string.Empty;

    [JsonPropertyName("decision")]
    public string Decision { get; set; } = "learn";
}

public class AiMissingKeywordDto
{
    [JsonPropertyName("keyword")]
    public string Keyword { get; set; } = string.Empty;

    [JsonPropertyName("context")]
    public string Context { get; set; } = string.Empty;
}

public class AiSuggestionDto
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}

public class AiLearningPlanItemDto
{
    [JsonPropertyName("skill_name")]
    public string SkillName { get; set; } = string.Empty;

    [JsonPropertyName("priority")]
    public string Priority { get; set; } = "medium";

    [JsonPropertyName("why_it_matters")]
    public string WhyItMatters { get; set; } = string.Empty;

    [JsonPropertyName("difficulty")]
    public string Difficulty { get; set; } = "intermediate";

    [JsonPropertyName("estimated_hours")]
    public int EstimatedHours { get; set; }

    [JsonPropertyName("free_resource")]
    public AiResourceDto? FreeResource { get; set; }

    [JsonPropertyName("paid_resource")]
    public AiResourceDto? PaidResource { get; set; }

    [JsonPropertyName("practice_project")]
    public string PracticeProject { get; set; } = string.Empty;
}

public class AiResourceDto
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}

public class AiResumeEntitiesDto
{
    [JsonPropertyName("skills")]
    public List<string> Skills { get; set; } = new();

    [JsonPropertyName("education")]
    public List<string> Education { get; set; } = new();

    [JsonPropertyName("certifications")]
    public List<string> Certifications { get; set; } = new();

    [JsonPropertyName("projects")]
    public List<string> Projects { get; set; } = new();

    [JsonPropertyName("achievements")]
    public List<string> Achievements { get; set; } = new();

    [JsonPropertyName("sections_found")]
    public List<string> SectionsFound { get; set; } = new();

    [JsonPropertyName("action_verbs_count")]
    public int ActionVerbsCount { get; set; }
}

public class AiJdEntitiesDto
{
    [JsonPropertyName("required_skills")]
    public List<string> RequiredSkills { get; set; } = new();

    [JsonPropertyName("preferred_skills")]
    public List<string> PreferredSkills { get; set; } = new();

    [JsonPropertyName("seniority_signals")]
    public List<string> SenioritySignals { get; set; } = new();

    [JsonPropertyName("education_requirements")]
    public List<string> EducationRequirements { get; set; } = new();

    [JsonPropertyName("keyword_frequencies")]
    public Dictionary<string, int> KeywordFrequencies { get; set; } = new();
}

/// <summary>Response from POST /generate-resume on the AI service.</summary>
public class AiResumeGenerationResponseDto
{
    [JsonPropertyName("plain_text")]
    public string PlainText { get; set; } = string.Empty;

    [JsonPropertyName("content_json")]
    public Dictionary<string, object> ContentJson { get; set; } = new();

    [JsonPropertyName("overall_score")]
    public decimal OverallScore { get; set; }
}
