using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

/// <summary>
/// Returns the learning plan for an analysis.
/// Reads directly from CourseRecommendations (persisted by AnalysisService from AI output)
/// and enriches each item with real user progress from UserCourseProgresses.
/// No hardcoded stub data. No dependency on LearningResourceService.
/// </summary>
public class LearningPlanService : ILearningPlanService
{
    private readonly AppDbContext _context;

    public LearningPlanService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LearningPlanItemDto>> GetLearningPlanAsync(Guid userId, Guid analysisId)
    {
        // 1. Verify the analysis belongs to this user
        var analysisExists = await _context.Analyses
            .AnyAsync(a => a.Id == analysisId && a.UserId == userId);

        if (!analysisExists)
            throw new ArgumentException("Analysis not found or does not belong to the user.");

        // 2. Load CourseRecommendations stored by AnalysisService from AI output
        var recommendations = await _context.CourseRecommendations
            .Where(c => c.AnalysisId == analysisId)
            .OrderBy(c => c.Priority == "high" ? 0 : c.Priority == "medium" ? 1 : 2)
            .ThenBy(c => c.SkillName)
            .ToListAsync();

        if (!recommendations.Any())
            return new List<LearningPlanItemDto>();

        // 3. Load real progress for this user for all these recommendations
        var recommendationIds = recommendations.Select(r => r.Id).ToList();
        var progressMap = await _context.UserCourseProgresses
            .Where(p => p.UserId == userId && recommendationIds.Contains(p.CourseRecommendationId))
            .ToDictionaryAsync(p => p.CourseRecommendationId);

        // 4. Build result from real DB data — no hardcoded stubs
        var planItems = recommendations.Select(rec =>
        {
            progressMap.TryGetValue(rec.Id, out var prog);

            return new LearningPlanItemDto
            {
                SkillName = rec.SkillName,
                Priority = rec.Priority,
                // WhyItMatters from AI output — stored at analysis time
                WhyItMatters = string.IsNullOrWhiteSpace(rec.WhyItMatters)
                    ? $"Required for the target role based on the job description analysis."
                    : rec.WhyItMatters,
                Difficulty = rec.Difficulty,
                EstimatedHours = rec.EstimatedHours > 0 ? rec.EstimatedHours : 15,
                FreeResource = string.IsNullOrWhiteSpace(rec.FreeResourceTitle)
                    ? null
                    : new ResourceLinkDto { Title = rec.FreeResourceTitle, Url = rec.FreeResourceUrl },
                PaidResource = string.IsNullOrWhiteSpace(rec.PaidResourceTitle)
                    ? null
                    : new ResourceLinkDto { Title = rec.PaidResourceTitle, Url = rec.PaidResourceUrl },
                PracticeProject = rec.PracticeProject,
                // Real persisted progress — starts at 0 until user updates it
                Progress = new ProgressDto
                {
                    Status = prog?.Status ?? "not_started",
                    PercentComplete = prog?.PercentComplete ?? 0,
                },
            };
        }).ToList();

        return planItems;
    }
}
