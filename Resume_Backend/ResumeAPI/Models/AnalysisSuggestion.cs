using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class AnalysisSuggestion
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AnalysisId { get; set; }

    /// <summary>section | quality | targeting | scoring</summary>
    [Required]
    [MaxLength(64)]
    public string Type { get; set; } = string.Empty;

    /// <summary>Short title describing the suggestion.</summary>
    [MaxLength(512)]
    public string Title { get; set; } = string.Empty;

    /// <summary>Detailed explanation and actionable advice.</summary>
    public string Description { get; set; } = string.Empty;

    // Navigation
    public Analysis? Analysis { get; set; }
}
