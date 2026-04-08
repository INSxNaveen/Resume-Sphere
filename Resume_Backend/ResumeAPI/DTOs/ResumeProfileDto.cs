using System;
using System.Collections.Generic;

namespace ResumeAPI.DTOs;

public class ResumeProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ResumeText { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new List<string>();
    public string ExperienceSummary { get; set; } = string.Empty;
    public Guid ResumeId { get; set; }
}
