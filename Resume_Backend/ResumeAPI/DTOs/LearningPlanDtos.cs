namespace ResumeAPI.DTOs;

public class LearningPlanItemDto
{
    public string SkillName { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string WhyItMatters { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public int EstimatedHours { get; set; }
    public ResourceLinkDto? FreeResource { get; set; }
    public ResourceLinkDto? PaidResource { get; set; }
    public string PracticeProject { get; set; } = string.Empty;
    public ProgressDto Progress { get; set; } = new ProgressDto();
}

public class ResourceLinkDto
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class ProgressDto
{
    public string Status { get; set; } = "not_started";
    public int PercentComplete { get; set; } = 0;
}
