using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class BlockedIp
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(64)]
    public string IpAddress { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
}
