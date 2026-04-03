using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class JobDescription
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    /// <summary>Full pasted job description text.</summary>
    public string RawText { get; set; } = string.Empty;

    /// <summary>Cleaned / normalized version.</summary>
    public string NormalizedText { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string RoleTitle { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? CompanyName { get; set; }

    [MaxLength(128)]
    public string? ExperienceLevel { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public ICollection<Analysis> Analyses { get; set; } = new List<Analysis>();
    public ICollection<JobDescriptionExtractedSkill> ExtractedSkills { get; set; } = new List<JobDescriptionExtractedSkill>();
}
