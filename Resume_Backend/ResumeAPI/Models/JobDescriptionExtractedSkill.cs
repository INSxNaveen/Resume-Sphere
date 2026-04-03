using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class JobDescriptionExtractedSkill
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid JobDescriptionId { get; set; }

    [Required]
    public Guid AnalysisId { get; set; }

    /// <summary>Normalized skill name.</summary>
    [Required]
    [MaxLength(256)]
    public string SkillName { get; set; } = string.Empty;

    /// <summary>required | preferred</summary>
    [MaxLength(32)]
    public string Priority { get; set; } = "required";

    /// <summary>How many times this keyword appears in the JD.</summary>
    public int KeywordFrequency { get; set; }

    // Navigation
    public JobDescription? JobDescription { get; set; }
    public Analysis? Analysis { get; set; }
}
