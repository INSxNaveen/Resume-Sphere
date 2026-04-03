using Microsoft.AspNetCore.Mvc;
using ResumeAPI.DTOs;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/skill-gap")]
public class SkillGapController : ControllerBase
{
    private readonly ISkillGapService _skillGapService;

    public SkillGapController(ISkillGapService skillGapService)
    {
        _skillGapService = skillGapService;
    }

    /// <summary>
    /// Identify missing skills between a resume and a specific job.
    /// Returns matched skills, missing skills, and match percentage.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<SkillGapResult>> GetSkillGap(
        [FromQuery] Guid resumeId,
        [FromQuery] int jobId)
    {
        try
        {
            var result = await _skillGapService.GetGapAsync(resumeId, jobId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
