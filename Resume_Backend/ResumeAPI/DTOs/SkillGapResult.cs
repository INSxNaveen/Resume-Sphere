namespace ResumeAPI.DTOs;

public class SkillGapResult
{
    public Guid ResumeId { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public List<string> ResumeSkills { get; set; } = new();
    public List<string> MatchedSkills { get; set; } = new();
    public List<MissingSkillDetail> MissingSkills { get; set; } = new();
    public double MatchScore { get; set; }
}
