using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeAPI.Models;

public class Resume
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(512)]
    public string FileName { get; set; } = string.Empty;

    /// <summary>PDF or DOCX</summary>
    [MaxLength(10)]
    public string FileType { get; set; } = string.Empty;

    /// <summary>Full extracted raw text from the resume file.</summary>
    public string RawText { get; set; } = string.Empty;

    /// <summary>Cleaned / normalized version of raw text.</summary>
    public string NormalizedText { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public ICollection<Analysis> Analyses { get; set; } = new List<Analysis>();
    public ICollection<ResumeExtractedSkill> ExtractedSkills { get; set; } = new List<ResumeExtractedSkill>();
}
