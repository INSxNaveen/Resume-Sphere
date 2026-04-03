using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class AnalysisMissingKeyword
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AnalysisId { get; set; }

    [Required]
    [MaxLength(256)]
    public string Keyword { get; set; } = string.Empty;

    /// <summary>Context explaining where this keyword was found in the JD.</summary>
    public string Context { get; set; } = string.Empty;

    // Navigation
    public Analysis? Analysis { get; set; }
}
