namespace ResumeAPI.Models;

public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
