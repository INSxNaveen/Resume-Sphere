using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/learning-plan")]
public class LearningPlanController : ControllerBase
{
    private readonly ILearningPlanService _learningPlanService;
    private readonly ILogger<LearningPlanController> _logger;

    public LearningPlanController(ILearningPlanService learningPlanService, ILogger<LearningPlanController> logger)
    {
        _learningPlanService = learningPlanService;
        _logger = logger;
    }

    [HttpGet("{analysisId}")]
    public async Task<IActionResult> GetLearningPlan(Guid analysisId)
    {
        try
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new { error = "Invalid user token." });
            }

            var plan = await _learningPlanService.GetLearningPlanAsync(userId, analysisId);
            return Ok(plan);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating learning plan");
            return StatusCode(500, new { error = "An error occurred while generating the learning plan." });
        }
    }
}
