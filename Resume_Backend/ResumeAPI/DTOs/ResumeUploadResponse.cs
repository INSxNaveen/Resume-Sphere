namespace ResumeAPI.DTOs;

public class ResumeUploadResponse
{
    public Guid ResumeId { get; set; }
    public Guid UserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public List<string> ExtractedSkills { get; set; } = new();
}
