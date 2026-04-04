using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? q, [FromQuery] string? category)
    {
        var results = await _jobService.SearchJobsAsync(q, category);
        return Ok(results);
    }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly IJobService _jobService;

    public CompaniesController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeatured([FromQuery] string? category)
    {
        var results = await _jobService.GetFeaturedCompaniesAsync(category);
        return Ok(results);
    }

    [HttpGet("{name}")]
    public async Task<IActionResult> GetDetails(string name)
    {
        var result = await _jobService.GetCompanyDetailsAsync(name);
        if (result == null) return NotFound();
        return Ok(result);
    }
}
