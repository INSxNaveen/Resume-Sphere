namespace ResumeAPI.Models;

public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
