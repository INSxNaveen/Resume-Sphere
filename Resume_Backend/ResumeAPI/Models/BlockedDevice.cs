using System.ComponentModel.DataAnnotations;

namespace ResumeAPI.Models;

public class BlockedDevice
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(256)]
    public string DeviceHash { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string Reason { get; set; } = string.Empty;

    public DateTime CreatesAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
}
