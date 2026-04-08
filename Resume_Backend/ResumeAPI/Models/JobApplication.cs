using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeAPI.Models;

public enum ApplicationStatus
{
    Applied,
    Skipped,
    Failed,
    InterviewScheduled
}

public class JobApplication
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(256)]
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string CompanyName { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string LinkedInJobUrl { get; set; } = string.Empty;

    [Column(TypeName = "decimal(5,2)")]
    public decimal MatchScore { get; set; }

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

    // Navigation
    public User? User { get; set; }
}
