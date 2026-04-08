using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;

namespace ResumeAPI.Services;

/// <summary>
/// Orchestrates the full analysis flow:
/// 1. Validates resume ownership
/// 2. Calls the Python FastAPI AI service with resume text
/// 3. Persists all structured results in PostgreSQL
/// 4. Returns the complete analysis result
/// </summary>
public class AnalysisService : IAnalysisService
{
    private readonly AppDbContext _context;
    private readonly IAiAnalysisService _aiService;
    private readonly ILogger<AnalysisService> _logger;

    public AnalysisService(
        AppDbContext context,
        IAiAnalysisService aiService,
        ILogger<AnalysisService> logger)
    {
        _context = context;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<AnalysisResultDto> RunAnalysisAsync(Guid userId, RunAnalysisRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        if (request.ResumeId == Guid.Empty)
            throw new ArgumentException("ResumeId is required.", nameof(request));

        // 1. Validate resume ownership
        var resume = await _context.Resumes
            .FirstOrDefaultAsync(r => r.Id == request.ResumeId && r.UserId == userId);

        if (resume == null)
            throw new ArgumentException("Resume not found or does not belong to user.");

        // 2. Call AI service
        var aiResult = await _aiService.AnalyzeAsync(resume.RawText);

        if (aiResult == null)
        {
            _logger.LogError("AI service returned null for ResumeId: {ResumeId}, UserId: {UserId}", request.ResumeId, userId);
            throw new InvalidOperationException(
                "AI analysis service is currently unavailable. Please ensure the AI service is running on the configured URL and try again.");
        }

        // 3. Normalize / clean AI output
        var currentSkills = (aiResult.CurrentSkills ?? new List<string>())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var eligibleJobs = (aiResult.EligibleJobs ?? new List<AiEligibleJobDto>())
            .Select(j => new EligibleJobDto
            {
                Title = j.Title,
                FitReason = j.FitReason,
                MatchScore = j.MatchScore,
                MissingSkills = j.MissingSkills ?? new List<string>()
            })
            .ToList();

        var improvementSuggestions = (aiResult.ImprovementSuggestions ?? new List<AiImprovementSuggestionDto>())
            .Select(s => new ImprovementSuggestionDto
            {
                Skill = s.Skill,
                Reason = s.Reason,
                Priority = s.Priority
            })
            .ToList();

        var unlockedOpportunities = (aiResult.UnlockedOpportunities ?? new List<AiUnlockedOpportunityDto>())
            .Select(o => new UnlockedOpportunityDto
            {
                Title = o.Title,
                WhyUnlocked = o.WhyUnlocked,
                RequiredAddedSkills = o.RequiredAddedSkills ?? new List<string>()
            })
            .ToList();

        // 4. Persist analysis + related data in one transaction
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var analysis = new Analysis
            {
                UserId = userId,
                ResumeId = resume.Id,
                CurrentSkillsJson = JsonSerializer.Serialize(currentSkills),
                EligibleJobsJson = JsonSerializer.Serialize(eligibleJobs),
                ImprovementSuggestionsJson = JsonSerializer.Serialize(improvementSuggestions),
                UnlockedOpportunitiesJson = JsonSerializer.Serialize(unlockedOpportunities),
                Status = "completed",
                CreatedAt = DateTime.UtcNow,
            };

            _context.Analyses.Add(analysis);
            await _context.SaveChangesAsync();

            // Persist extracted skills
            foreach (var skill in currentSkills)
            {
                _context.ResumeExtractedSkills.Add(new ResumeExtractedSkill
                {
                    AnalysisId = analysis.Id,
                    ResumeId = resume.Id,
                    SkillName = skill,
                    Section = "Matched",
                    Confidence = 1.0m,
                });
            }

            // Persist course recommendations from improvement suggestions
            foreach (var suggestion in improvementSuggestions)
            {
                _context.CourseRecommendations.Add(new CourseRecommendation
                {
                    AnalysisId = analysis.Id,
                    SkillName = suggestion.Skill,
                    Priority = string.IsNullOrWhiteSpace(suggestion.Priority) ? "medium" : suggestion.Priority.ToLowerInvariant(),
                    WhyItMatters = suggestion.Reason,
                    Difficulty = "beginner",
                    EstimatedHours = 15,
                });
            }

            // Persist analysis history
            _context.AnalysisHistories.Add(new AnalysisHistory
            {
                UserId = userId,
                AnalysisId = analysis.Id,
                EventType = "analysis_completed",
                OccurredAt = DateTime.UtcNow,
            });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // 5. Return final DTO
            return new AnalysisResultDto
            {
                AnalysisId = analysis.Id,
                CurrentSkills = currentSkills,
                EligibleJobs = eligibleJobs,
                ImprovementSuggestions = improvementSuggestions,
                UnlockedOpportunities = unlockedOpportunities,
                Status = analysis.Status,
                CreatedAt = analysis.CreatedAt,
                ResumeId = analysis.ResumeId,
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Failed to complete analysis for ResumeId: {ResumeId}, UserId: {UserId}", request.ResumeId, userId);
            throw;
        }
    }

    public async Task<AnalysisResultDto?> GetAnalysisAsync(Guid userId, Guid analysisId)
    {
        var analysis = await _context.Analyses
            .Include(a => a.ResumeExtractedSkills)
            .FirstOrDefaultAsync(a => a.Id == analysisId && a.UserId == userId);

        if (analysis == null)
            return null;

        var eligibleJobs = string.IsNullOrWhiteSpace(analysis.EligibleJobsJson)
            ? new List<EligibleJobDto>()
            : JsonSerializer.Deserialize<List<EligibleJobDto>>(analysis.EligibleJobsJson) ?? new List<EligibleJobDto>();

        var improvementSuggestions = string.IsNullOrWhiteSpace(analysis.ImprovementSuggestionsJson)
            ? new List<ImprovementSuggestionDto>()
            : JsonSerializer.Deserialize<List<ImprovementSuggestionDto>>(analysis.ImprovementSuggestionsJson) ?? new List<ImprovementSuggestionDto>();

        var unlockedOpportunities = string.IsNullOrWhiteSpace(analysis.UnlockedOpportunitiesJson)
            ? new List<UnlockedOpportunityDto>()
            : JsonSerializer.Deserialize<List<UnlockedOpportunityDto>>(analysis.UnlockedOpportunitiesJson) ?? new List<UnlockedOpportunityDto>();

        var currentSkills = analysis.ResumeExtractedSkills.Any()
            ? analysis.ResumeExtractedSkills
                .Where(s => !string.IsNullOrWhiteSpace(s.SkillName))
                .Select(s => s.SkillName.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList()
            : (string.IsNullOrWhiteSpace(analysis.CurrentSkillsJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(analysis.CurrentSkillsJson) ?? new List<string>());

        return new AnalysisResultDto
        {
            AnalysisId = analysis.Id,
            CurrentSkills = currentSkills,
            EligibleJobs = eligibleJobs,
            ImprovementSuggestions = improvementSuggestions,
            UnlockedOpportunities = unlockedOpportunities,
            Status = analysis.Status,
            CreatedAt = analysis.CreatedAt,
            ResumeId = analysis.ResumeId,
        };
    }

    public async Task<List<AnalysisHistoryDto>> GetAnalysisHistoryAsync(Guid userId)
    {
        var analyses = await _context.Analyses
            .Where(a => a.UserId == userId && a.Status == "completed")
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        var historyDtos = new List<AnalysisHistoryDto>();

        foreach (var analysis in analyses)
        {
            var eligibleJobs = string.IsNullOrWhiteSpace(analysis.EligibleJobsJson)
                ? new List<EligibleJobDto>()
                : JsonSerializer.Deserialize<List<EligibleJobDto>>(analysis.EligibleJobsJson) ?? new List<EligibleJobDto>();

            var currentSkills = string.IsNullOrWhiteSpace(analysis.CurrentSkillsJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(analysis.CurrentSkillsJson) ?? new List<string>();

            var topJob = eligibleJobs
                .OrderByDescending(j => j.MatchScore)
                .FirstOrDefault();

            // Calculate skill counts
            int matchedCount = currentSkills.Count;
            int missingCount = topJob?.MissingSkills?.Count ?? 0;

            // FILTER: Skip 'junk' results that have no skills and no match (failed or empty runs)
            if (matchedCount == 0 && (topJob == null || topJob.MatchScore <= 0))
            {
                continue;
            }

            historyDtos.Add(new AnalysisHistoryDto
            {
                AnalysisId = analysis.Id,
                CreatedAt = analysis.CreatedAt,
                OverallScore = topJob?.MatchScore ?? 0,
                RoleTitle = topJob?.Title ?? "General Role",
                CompanyName = "Target Company", // Could be enhanced if company was extracted
                MatchedSkillsCount = matchedCount,
                MissingSkillsCount = missingCount
            });
        }

        return historyDtos;
    }

    public async Task<bool> DeleteAnalysisAsync(Guid userId, Guid analysisId)
    {
        var analysis = await _context.Analyses
            .FirstOrDefaultAsync(a => a.Id == analysisId && a.UserId == userId);

        if (analysis == null)
            return false;

        _context.Analyses.Remove(analysis);
        await _context.SaveChangesAsync();
        return true;
    }
}