using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class AnalysisHistory
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid AnalysisId { get; set; }

    /// <summary>created | updated | score_changed | resume_generated</summary>
    [Required]
    [MaxLength(64)]
    public string EventType { get; set; } = string.Empty;

    /// <summary>Free-form text or JSON describing what changed.</summary>
    public string EventDetail { get; set; } = string.Empty;

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public Analysis? Analysis { get; set; }
}
