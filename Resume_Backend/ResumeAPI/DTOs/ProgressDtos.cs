namespace ResumeAPI.DTOs;

public class UpdateProgressRequestDto
{
    public Guid AnalysisId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string Status { get; set; } = "not_started";
    public int PercentComplete { get; set; }
}

public class UpdateProgressResponseDto
{
    public Guid ProgressId { get; set; }
    public Guid UserId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int PercentComplete { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
