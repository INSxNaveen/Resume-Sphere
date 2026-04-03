using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class ResumeExtractedSkill
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ResumeId { get; set; }

    [Required]
    public Guid AnalysisId { get; set; }

    /// <summary>Normalized skill name (e.g. "JavaScript" not "JS").</summary>
    [Required]
    [MaxLength(256)]
    public string SkillName { get; set; } = string.Empty;

    /// <summary>Which section this skill was found in (Skills, Projects, Experience, etc.).</summary>
    [MaxLength(128)]
    public string Section { get; set; } = string.Empty;

    /// <summary>Extraction confidence score between 0 and 1.</summary>
    public decimal Confidence { get; set; }

    // Navigation
    public Resume? Resume { get; set; }
    public Analysis? Analysis { get; set; }
}
