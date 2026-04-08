namespace ResumeAPI.DTOs;

public class JobDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string JobUrl { get; set; } = string.Empty;
    public double? SalaryMin { get; set; }
    public double? SalaryMax { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int MatchScore { get; set; } = 85; // Calculated internal score
}

public class CompanyDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public int ActiveOpenings { get; set; }
    public List<string> CommonSkills { get; set; } = new();
}
