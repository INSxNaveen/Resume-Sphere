using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class UserCourseSelection
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid CourseRecommendationId { get; set; }

    public DateTime SelectedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public CourseRecommendation? CourseRecommendation { get; set; }
}
