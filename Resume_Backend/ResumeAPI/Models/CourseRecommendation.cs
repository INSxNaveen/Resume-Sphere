using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class CourseRecommendation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AnalysisId { get; set; }

    [Required]
    [MaxLength(256)]
    public string SkillName { get; set; } = string.Empty;

    /// <summary>high | medium | low</summary>
    [MaxLength(32)]
    public string Priority { get; set; } = "medium";

    /// <summary>Explanation from AI about why this skill matters for the target role.</summary>
    [MaxLength(1024)]
    public string WhyItMatters { get; set; } = string.Empty;

    /// <summary>beginner | intermediate | advanced</summary>
    [MaxLength(32)]
    public string Difficulty { get; set; } = "beginner";

    public int EstimatedHours { get; set; }

    [MaxLength(512)]
    public string FreeResourceTitle { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string FreeResourceUrl { get; set; } = string.Empty;

    [MaxLength(512)]
    public string PaidResourceTitle { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string PaidResourceUrl { get; set; } = string.Empty;

    /// <summary>Description of a hands-on practice project to reinforce the skill.</summary>
    public string PracticeProject { get; set; } = string.Empty;

    // Navigation
    public Analysis? Analysis { get; set; }
    public ICollection<UserCourseSelection> UserSelections { get; set; } = new List<UserCourseSelection>();
    public ICollection<UserCourseProgress> UserProgresses { get; set; } = new List<UserCourseProgress>();
}
