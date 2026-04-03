namespace ResumeAPI.DTOs;

public class JobMatchResult
{
    public int JobId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredSkills { get; set; } = new();
    public List<string> MatchedSkills { get; set; } = new();
    public List<MissingSkillDetail> MissingSkills { get; set; } = new();
    public double MatchScore { get; set; }
    public string MatchExplanation { get; set; } = string.Empty;
}
