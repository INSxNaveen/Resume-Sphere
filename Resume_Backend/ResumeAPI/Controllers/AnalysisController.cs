using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeAPI.DTOs;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly IAnalysisService _analysisService;
    private readonly ILogger<AnalysisController> _logger;

    public AnalysisController(IAnalysisService analysisService, ILogger<AnalysisController> logger)
    {
        _analysisService = analysisService;
        _logger = logger;
    }

    [HttpPost("run")]
    public async Task<IActionResult> RunAnalysis([FromBody] RunAnalysisRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _analysisService.RunAnalysisAsync(userId, request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error running analysis");
            return StatusCode(500, new { error = "An error occurred while running the analysis." });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAnalysis(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _analysisService.GetAnalysisAsync(userId, id);
            
            if (result == null) return NotFound(new { error = "Analysis not found." });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving analysis");
            return StatusCode(500, new { error = "An error occurred while retrieving the analysis." });
        }
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetAnalysisHistory()
    {
        try
        {
            var userId = GetUserId();
            var history = await _analysisService.GetAnalysisHistoryAsync(userId);
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving analysis history");
            return StatusCode(500, new { error = "An error occurred while retrieving analysis history." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnalysis(Guid id)
    {
        try
        {
            var userId = GetUserId();
            var success = await _analysisService.DeleteAnalysisAsync(userId, id);

            if (!success) return NotFound(new { error = "Analysis not found or could not be deleted." });

            return Ok(new { message = "Analysis deleted successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting analysis");
            return StatusCode(500, new { error = "An error occurred while deleting the analysis." });
        }
    }

    private Guid GetUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid or missing user ID in token.");
        }
        return userId;
    }
}
