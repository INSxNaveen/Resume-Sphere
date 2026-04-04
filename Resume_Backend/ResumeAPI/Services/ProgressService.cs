using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;

namespace ResumeAPI.Services;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _context;

    public ProgressService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateProgressResponseDto> UpdateProgressAsync(Guid userId, UpdateProgressRequestDto request)
    {
        // 1. Verify analysis belongs to user
        var analysis = await _context.Analyses.FirstOrDefaultAsync(a => a.Id == request.AnalysisId && a.UserId == userId);
        if (analysis == null)
        {
            throw new ArgumentException("Analysis not found or does not belong to the user.");
        }

        // 2. We need a CourseRecommendation to attach progress to. Check if one exists.
        var recommendation = await _context.CourseRecommendations
            .FirstOrDefaultAsync(c => c.AnalysisId == request.AnalysisId && c.SkillName.ToLower() == request.SkillName.ToLower());

        if (recommendation == null)
        {
            // Create a stub recommendation if it wasn't pre-generated
            recommendation = new CourseRecommendation
            {
                AnalysisId = request.AnalysisId,
                SkillName = request.SkillName,
                Priority = "Medium",
                Difficulty = "Beginner"
            };
            _context.CourseRecommendations.Add(recommendation);
            await _context.SaveChangesAsync();
        }

        // 3. Find or Create UserCourseProgress
        var progress = await _context.UserCourseProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.CourseRecommendationId == recommendation.Id);

        if (progress == null)
        {
            progress = new UserCourseProgress
            {
                UserId = userId,
                CourseRecommendationId = recommendation.Id,
                Status = request.Status,
                PercentComplete = request.PercentComplete,
                StartedAt = DateTime.UtcNow
            };
            _context.UserCourseProgresses.Add(progress);
        }
        else
        {
            progress.Status = request.Status;
            progress.PercentComplete = request.PercentComplete;
            if (progress.StartedAt == null)
            {
                progress.StartedAt = DateTime.UtcNow;
            }
        }

        if (request.Status.ToLower() == "completed" || request.PercentComplete == 100)
        {
            progress.CompletedAt = DateTime.UtcNow;
            progress.Status = "completed";
            progress.PercentComplete = 100;
        }

        await _context.SaveChangesAsync();

        return new UpdateProgressResponseDto
        {
            ProgressId = progress.Id,
            UserId = progress.UserId,
            SkillName = recommendation.SkillName,
            Status = progress.Status,
            PercentComplete = progress.PercentComplete,
            StartedAt = progress.StartedAt,
            CompletedAt = progress.CompletedAt
        };
    }
}
