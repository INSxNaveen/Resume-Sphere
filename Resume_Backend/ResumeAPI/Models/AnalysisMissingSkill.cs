using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class AnalysisMissingSkill
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

    /// <summary>Why this skill matters for the target role.</summary>
    public string WhyItMatters { get; set; } = string.Empty;

    /// <summary>add | learn</summary>
    [MaxLength(32)]
    public string Decision { get; set; } = "learn";

    // Navigation
    public Analysis? Analysis { get; set; }
}
