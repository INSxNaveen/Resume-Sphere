using Microsoft.AspNetCore.Mvc;
using ResumeAPI.DTOs;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly ILearningResourceService _resourceService;

    public ResourcesController(ILearningResourceService resourceService)
    {
        _resourceService = resourceService;
    }

    /// <summary>
    /// Get YouTube tutorial links and article links for a given skill.
    /// Useful for learning missing skills identified in a skill gap analysis.
    /// </summary>
    [HttpGet("{skill}")]
    public async Task<ActionResult<ResourceResult>> GetResources(string skill)
    {
        if (string.IsNullOrWhiteSpace(skill))
            return BadRequest("Skill name is required.");

        var result = await _resourceService.GetResourcesAsync(skill);
        return Ok(result);
    }

    /// <summary>Get all supported skill names that have curated resources.</summary>
    [HttpGet("supported-skills")]
    public IActionResult GetSupportedSkills()
    {
        var skills = new[]
        {
            "Python", "Java", "C#", "JavaScript", "TypeScript",
            "SQL", "PostgreSQL", "MySQL", "MongoDB",
            "React", "Angular", "Vue", "Node.js",
            ".NET", "ASP.NET Core",
            "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
            "Docker", "Kubernetes", "Git",
            "REST API", "GraphQL",
            "AWS", "Azure", "Linux",
            "Data Analysis", "Pandas", "Scikit-learn"
        };
        return Ok(skills);
    }
}
