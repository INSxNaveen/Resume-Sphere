using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(256)]
    public string FullName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // OTP and Email Verification
    [MaxLength(256)]
    public string? OtpHash { get; set; }
    
    public DateTime? OtpExpiry { get; set; }
    
    public bool IsEmailVerified { get; set; } = false;

    // Abuse Enforcement
    public int AbuseRiskScore { get; set; } = 0;
    
    public bool IsSuspended { get; set; } = false;
    
    public DateTime? SuspendedUntil { get; set; }

    // Navigation
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    public ICollection<JobDescription> JobDescriptions { get; set; } = new List<JobDescription>();
    public ICollection<Analysis> Analyses { get; set; } = new List<Analysis>();
    public ICollection<UserCourseSelection> CourseSelections { get; set; } = new List<UserCourseSelection>();
    public ICollection<UserCourseProgress> CourseProgresses { get; set; } = new List<UserCourseProgress>();
    public ICollection<GeneratedResume> GeneratedResumes { get; set; } = new List<GeneratedResume>();
    public ICollection<AnalysisHistory> AnalysisHistories { get; set; } = new List<AnalysisHistory>();
    public ICollection<UploadModerationEvent> ModerationEvents { get; set; } = new List<UploadModerationEvent>();
}
