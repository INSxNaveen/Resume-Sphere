using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.Models;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ApplicationsController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>Create a new job application record.</summary>
    [HttpPost]
    public async Task<ActionResult<JobApplication>> Create([FromBody] JobApplication application)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        // Server-side rate limit: Max 50 per hour per user
        var oneHourAgo = DateTime.UtcNow.AddHours(-1);
        var recentCount = await _db.JobApplications
            .CountAsync(a => a.UserId == userId && a.AppliedAt > oneHourAgo);
        
        if (recentCount >= 50)
        {
            return StatusCode(429, "Too many applications. Please wait an hour.");
        }

        application.Id = Guid.NewGuid();
        application.UserId = userId;
        application.AppliedAt = DateTime.UtcNow;

        _db.JobApplications.Add(application);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    /// <summary>Get all job applications for the authenticated user, sorted by date descending.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobApplication>>> GetAll()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var applications = await _db.JobApplications
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();

        return Ok(applications);
    }

    /// <summary>Get a specific job application by ID (Internal helper for CreatedAtAction).</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobApplication>> GetById(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var application = await _db.JobApplications
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application == null) return NotFound();
        return Ok(application);
    }

    /// <summary>Update the status of a job application.</summary>
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<JobApplication>> UpdateStatus(Guid id, [FromBody] StatusUpdateRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var application = await _db.JobApplications
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application == null) return NotFound();

        application.Status = request.Status;
        await _db.SaveChangesAsync();

        return Ok(application);
    }

    public class StatusUpdateRequest
    {
        public ApplicationStatus Status { get; set; }
    }
}
