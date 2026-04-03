using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class UserCourseProgress
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid CourseRecommendationId { get; set; }

    /// <summary>not_started | started | in_progress | completed</summary>
    [Required]
    [MaxLength(32)]
    public string Status { get; set; } = "not_started";

    /// <summary>0–100. Only updated via real user actions — never seeded or randomized.</summary>
    public int PercentComplete { get; set; } = 0;

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime? LastUpdatedAt { get; set; }

    // Navigation
    public User? User { get; set; }
    public CourseRecommendation? CourseRecommendation { get; set; }
}
