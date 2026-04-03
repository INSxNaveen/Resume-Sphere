namespace ResumeAPI.DTOs;

public class JobMatchRequest
{
    public Guid ResumeId { get; set; }
    public int TopN { get; set; } = 10;
}
