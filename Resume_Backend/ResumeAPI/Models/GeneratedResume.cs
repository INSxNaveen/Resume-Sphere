using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class GeneratedResume
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid AnalysisId { get; set; }

    [MaxLength(256)]
    public string RoleTitle { get; set; } = string.Empty;

    /// <summary>Full resume structure stored as JSON.</summary>
    public string ContentJson { get; set; } = "{}";

    /// <summary>ATS-friendly plain text version of the resume.</summary>
    public string PlainText { get; set; } = string.Empty;

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Version counter for multiple drafts of the same analysis.</summary>
    public int Version { get; set; } = 1;

    // Navigation
    public User? User { get; set; }
    public Analysis? Analysis { get; set; }
}
