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

    public string CurrentSkillsJson { get; set; } = "[]";
    public string EligibleJobsJson { get; set; } = "[]";
    public string ImprovementSuggestionsJson { get; set; } = "[]";
    public string UnlockedOpportunitiesJson { get; set; } = "[]";

    [Required]
    [MaxLength(32)]
    public string Status { get; set; } = "pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Resume? Resume { get; set; }

    public ICollection<ResumeExtractedSkill> ResumeExtractedSkills { get; set; } = new List<ResumeExtractedSkill>();
    public ICollection<AnalysisSuggestion> Suggestions { get; set; } = new List<AnalysisSuggestion>();
    public ICollection<CourseRecommendation> CourseRecommendations { get; set; } = new List<CourseRecommendation>();
    public ICollection<GeneratedResume> GeneratedResumes { get; set; } = new List<GeneratedResume>();
    public ICollection<AnalysisHistory> AnalysisHistories { get; set; } = new List<AnalysisHistory>();
}