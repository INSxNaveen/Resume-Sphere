using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class Analysis
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid ResumeId { get; set; }

    [Required]
    public Guid JobDescriptionId { get; set; }

    /// <summary>Overall match score (0–100).</summary>
    public decimal OverallScore { get; set; }

    /// <summary>
    /// JSON blob storing per-category scores, e.g.:
    /// { "requiredSkillsScore": 72, "preferredSkillsScore": 65, ... }
    /// Persisted once — never recomputed on load.
    /// </summary>
    public string ScoreBreakdownJson { get; set; } = "{}";

    /// <summary>
    /// JSON array of human-readable score deduction reason strings.
    /// Persisted at analysis time so history loads can display them.
    /// </summary>
    public string DeductionReasonsJson { get; set; } = "[]";

    /// <summary>pending | processing | completed | failed</summary>
    [Required]
    [MaxLength(32)]
    public string Status { get; set; } = "pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public Resume? Resume { get; set; }
    public JobDescription? JobDescription { get; set; }
    public ICollection<ResumeExtractedSkill> ResumeExtractedSkills { get; set; } = new List<ResumeExtractedSkill>();
    public ICollection<JobDescriptionExtractedSkill> JdExtractedSkills { get; set; } = new List<JobDescriptionExtractedSkill>();
    public ICollection<AnalysisMissingSkill> MissingSkills { get; set; } = new List<AnalysisMissingSkill>();
    public ICollection<AnalysisMissingKeyword> MissingKeywords { get; set; } = new List<AnalysisMissingKeyword>();
    public ICollection<AnalysisSuggestion> Suggestions { get; set; } = new List<AnalysisSuggestion>();
    public ICollection<CourseRecommendation> CourseRecommendations { get; set; } = new List<CourseRecommendation>();
    public ICollection<GeneratedResume> GeneratedResumes { get; set; } = new List<GeneratedResume>();
    public ICollection<AnalysisHistory> AnalysisHistories { get; set; } = new List<AnalysisHistory>();
}
