using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;

namespace ResumeAPI.Services;

/// <summary>
/// Orchestrates the full analysis flow:
/// 1. Validates resume ownership
/// 2. Saves JD to database
/// 3. Calls the Python FastAPI AI service with resume text + JD text
/// 4. Persists all structured results (skills, keywords, suggestions) in PostgreSQL
/// 5. Returns the complete analysis result
/// </summary>
public class AnalysisService : IAnalysisService
{
    private readonly AppDbContext _context;
    private readonly IAiAnalysisService _aiService;
    private readonly ILogger<AnalysisService> _logger;

    public AnalysisService(AppDbContext context, IAiAnalysisService aiService, ILogger<AnalysisService> logger)
    {
        _context = context;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<AnalysisResultDto> RunAnalysisAsync(Guid userId, RunAnalysisRequestDto request)
    {
        // ── 1. Validate resume ──────────────────────────────────────────────
        var resume = await _context.Resumes
            .FirstOrDefaultAsync(r => r.Id == request.ResumeId && r.UserId == userId);

        if (resume == null)
            throw new ArgumentException("Resume not found or does not belong to user.");

        if (string.IsNullOrWhiteSpace(request.JobDescriptionText))
            throw new ArgumentException("Job description text is required.");

        if (string.IsNullOrWhiteSpace(request.RoleTitle))
            throw new ArgumentException("Role title is required.");

        // ── 2. Save the raw JD ──────────────────────────────────────────────
        var jd = new JobDescription
        {
            UserId = userId,
            RawText = request.JobDescriptionText,
            RoleTitle = request.RoleTitle,
            CompanyName = request.CompanyName,
            ExperienceLevel = request.ExperienceLevel,
            NormalizedText = request.JobDescriptionText.ToLower(),
            CreatedAt = DateTime.UtcNow,
        };
        _context.JobDescriptions.Add(jd);
        await _context.SaveChangesAsync();

        // ── 3. Call the AI service ──────────────────────────────────────────
        var aiResult = await _aiService.AnalyzeAsync(
            resume.RawText,
            request.JobDescriptionText,
            request.RoleTitle,
            request.CompanyName ?? "",
            request.ExperienceLevel ?? ""
        );

        if (aiResult == null)
        {
            _logger.LogError("AI service returned null — service may be down");
            throw new InvalidOperationException(
                "AI analysis service is currently unavailable. Please ensure the AI service is running on the configured URL and try again.");
        }

        // ── 4. Build score breakdown JSON ───────────────────────────────────
        var breakdown = new ScoreBreakdownDto
        {
            RequiredSkillsScore = aiResult.ScoreBreakdown.RequiredSkillsScore,
            PreferredSkillsScore = aiResult.ScoreBreakdown.PreferredSkillsScore,
            AtsKeywordsScore = aiResult.ScoreBreakdown.AtsKeywordsScore,
            ExperienceRelevanceScore = aiResult.ScoreBreakdown.ExperienceRelevanceScore,
            EducationScore = aiResult.ScoreBreakdown.EducationScore,
            ResumeQualityScore = aiResult.ScoreBreakdown.ResumeQualityScore,
        };

        // ── 5. Persist Analysis entity ──────────────────────────────────────
        var analysis = new Analysis
        {
            UserId = userId,
            ResumeId = resume.Id,
            JobDescriptionId = jd.Id,
            OverallScore = aiResult.OverallScore,
            ScoreBreakdownJson = JsonSerializer.Serialize(breakdown),
            DeductionReasonsJson = JsonSerializer.Serialize(aiResult.DeductionReasons),
            Status = "completed",
            CreatedAt = DateTime.UtcNow,
        };
        _context.Analyses.Add(analysis);
        await _context.SaveChangesAsync();

        // ── 6. Persist extracted resume skills ──────────────────────────────
        foreach (var skill in aiResult.MatchedSkills)
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

        // ── 7. Persist JD extracted skills ──────────────────────────────────
        foreach (var skill in aiResult.JdEntities.RequiredSkills)
        {
            _context.JobDescriptionExtractedSkills.Add(new JobDescriptionExtractedSkill
            {
                AnalysisId = analysis.Id,
                JobDescriptionId = jd.Id,
                SkillName = skill,
                Priority = "required",
            });
        }
        foreach (var skill in aiResult.JdEntities.PreferredSkills)
        {
            _context.JobDescriptionExtractedSkills.Add(new JobDescriptionExtractedSkill
            {
                AnalysisId = analysis.Id,
                JobDescriptionId = jd.Id,
                SkillName = skill,
                Priority = "preferred",
            });
        }

        // ── 8. Persist missing skills ───────────────────────────────────────
        foreach (var ms in aiResult.MissingSkills)
        {
            _context.AnalysisMissingSkills.Add(new AnalysisMissingSkill
            {
                AnalysisId = analysis.Id,
                SkillName = ms.SkillName,
                Priority = ms.Priority,
                Decision = ms.Decision,
            });
        }

        // ── 9. Persist missing ATS keywords ─────────────────────────────────
        foreach (var kw in aiResult.MissingKeywords)
        {
            _context.AnalysisMissingKeywords.Add(new AnalysisMissingKeyword
            {
                AnalysisId = analysis.Id,
                Keyword = kw.Keyword,
                Context = kw.Context,
            });
        }

        // ── 10. Persist suggestions ─────────────────────────────────────────
        foreach (var sug in aiResult.Suggestions)
        {
            _context.AnalysisSuggestions.Add(new AnalysisSuggestion
            {
                AnalysisId = analysis.Id,
                Type = sug.Type,
                Title = sug.Title,
                Description = sug.Description,
            });
        }

        // ── 11. Persist course recommendations from learning plan ────────────
        foreach (var item in aiResult.LearningPlan)
        {
            _context.CourseRecommendations.Add(new CourseRecommendation
            {
                AnalysisId = analysis.Id,
                SkillName = item.SkillName,
                Priority = item.Priority,
                WhyItMatters = item.WhyItMatters,
                Difficulty = item.Difficulty,
                EstimatedHours = item.EstimatedHours,
                FreeResourceTitle = item.FreeResource?.Title ?? "",
                FreeResourceUrl = item.FreeResource?.Url ?? "",
                PaidResourceTitle = item.PaidResource?.Title ?? "",
                PaidResourceUrl = item.PaidResource?.Url ?? "",
                PracticeProject = item.PracticeProject,
            });
        }

        // ── 12. Persist analysis history event ──────────────────────────────
        _context.AnalysisHistories.Add(new AnalysisHistory
        {
            UserId = userId,
            AnalysisId = analysis.Id,
            EventType = "analysis_completed",
            OccurredAt = DateTime.UtcNow,
        });

        await _context.SaveChangesAsync();

        // ── 13. Return result DTO ───────────────────────────────────────────
        return new AnalysisResultDto
        {
            AnalysisId = analysis.Id,
            OverallScore = aiResult.OverallScore,
            MatchedSkills = aiResult.MatchedSkills,
            MissingSkills = aiResult.MissingSkills.Select(ms => new MissingSkillDetail
            {
                SkillName = ms.SkillName,
                Explanation = ms.WhyItMatters,
                JobRelevance = ms.Priority,
            }).ToList(),
            MissingKeywords = aiResult.MissingKeywords.Select(kw => new MissingKeywordDetail
            {
                Keyword = kw.Keyword,
                Context = kw.Context,
            }).ToList(),
            ScoreBreakdown = breakdown,
            DeductionReasons = aiResult.DeductionReasons,
            Suggestions = aiResult.Suggestions.Select(s => new SuggestionDetail
            {
                Type = s.Type,
                Title = s.Title,
                Description = s.Description,
            }).ToList(),
            Status = analysis.Status,
            CreatedAt = analysis.CreatedAt,
            ResumeId = analysis.ResumeId,
            JobDescriptionId = jd.Id,
        };
    }

    public async Task<AnalysisResultDto?> GetAnalysisAsync(Guid userId, Guid analysisId)
    {
        var analysis = await _context.Analyses
            .Include(a => a.MissingSkills)
            .Include(a => a.MissingKeywords)
            .Include(a => a.Suggestions)
            .Include(a => a.ResumeExtractedSkills)
            .Include(a => a.JobDescription)
            .FirstOrDefaultAsync(a => a.Id == analysisId && a.UserId == userId);

        if (analysis == null) return null;

        var breakdown = JsonSerializer.Deserialize<ScoreBreakdownDto>(analysis.ScoreBreakdownJson)
                        ?? new ScoreBreakdownDto();

        var storedDeductions = string.IsNullOrWhiteSpace(analysis.DeductionReasonsJson)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(analysis.DeductionReasonsJson) ?? new List<string>();

        return new AnalysisResultDto
        {
            AnalysisId = analysis.Id,
            OverallScore = analysis.OverallScore,
            MatchedSkills = analysis.ResumeExtractedSkills
                .Where(s => s.Section == "Matched")
                .Select(s => s.SkillName)
                .Distinct()
                .ToList(),
            MissingSkills = analysis.MissingSkills.Select(ms => new MissingSkillDetail
            {
                SkillName = ms.SkillName,
                Explanation = $"Required for the {analysis.JobDescription?.RoleTitle ?? "target"} role",
                JobRelevance = ms.Priority ?? "medium",
            }).ToList(),
            MissingKeywords = analysis.MissingKeywords.Select(kw => new MissingKeywordDetail
            {
                Keyword = kw.Keyword,
                Context = kw.Context ?? "",
            }).ToList(),
            ScoreBreakdown = breakdown,
            DeductionReasons = storedDeductions,
            Suggestions = analysis.Suggestions.Select(s => new SuggestionDetail
            {
                Type = s.Type,
                Title = s.Title ?? "",
                Description = s.Description ?? "",
            }).ToList(),
            Status = analysis.Status,
            CreatedAt = analysis.CreatedAt,
            ResumeId = analysis.ResumeId,
            JobDescriptionId = analysis.JobDescriptionId,
        };
    }

    public async Task<List<AnalysisHistoryDto>> GetAnalysisHistoryAsync(Guid userId)
    {
        return await _context.Analyses
            .Include(a => a.JobDescription)
            .Include(a => a.MissingSkills)
            .Include(a => a.ResumeExtractedSkills)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AnalysisHistoryDto
            {
                AnalysisId = a.Id,
                RoleTitle = a.JobDescription!.RoleTitle,
                CompanyName = a.JobDescription.CompanyName,
                OverallScore = a.OverallScore,
                CreatedAt = a.CreatedAt,
                MatchedSkillsCount = a.ResumeExtractedSkills
                    .Where(s => s.Section == "Matched")
                    .Select(s => s.SkillName)
                    .Distinct()
                    .Count(),
                MissingSkillsCount = a.MissingSkills.Count,
            })
            .ToListAsync();
    }
}
