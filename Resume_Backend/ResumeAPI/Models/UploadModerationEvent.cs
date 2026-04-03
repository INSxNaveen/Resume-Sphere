using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class UploadModerationEvent
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }
    
    [MaxLength(512)]
    public string FileName { get; set; } = string.Empty;

    [MaxLength(128)]
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// e.g. "Allowed", "Suspicious", "Blocked"
    /// </summary>
    [MaxLength(32)]
    public string Decision { get; set; } = string.Empty;

    /// <summary>
    /// Explanation of the block or warning.
    /// </summary>
    [MaxLength(1024)]
    public string Reason { get; set; } = string.Empty;

    public int RiskScoreImpact { get; set; } = 0;

    [MaxLength(256)]
    public string? DeviceHash { get; set; }

    [MaxLength(64)]
    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
}
