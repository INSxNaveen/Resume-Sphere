namespace ResumeAPI.DTOs;

public class GenerateTailoredResumeRequestDto
{
    public Guid AnalysisId { get; set; }
}

public class ResumeGenerationResultDto
{
    public Guid GeneratedResumeId { get; set; }
    public Guid AnalysisId { get; set; }
    public string TailoredContent { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
