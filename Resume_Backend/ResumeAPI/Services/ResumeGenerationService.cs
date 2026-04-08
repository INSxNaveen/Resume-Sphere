using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;

namespace ResumeAPI.Services;

/// <summary>
/// Resume generation is deprecated in the resume-first pipeline.
/// This service returns a placeholder response to avoid breaking existing API contracts.
/// </summary>
public class ResumeGenerationService : IResumeGenerationService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ResumeGenerationService> _logger;

    public ResumeGenerationService(AppDbContext context, ILogger<ResumeGenerationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ResumeGenerationResultDto> GenerateTailoredResumeAsync(Guid userId, GenerateTailoredResumeRequestDto request)
    {
        _logger.LogWarning("GenerateTailoredResume called but is deprecated in resume-first pipeline.");
        throw new InvalidOperationException("Tailored resume generation has been deprecated. The resume-first analysis pipeline no longer supports JD-based generation.");
    }

    public async Task<ResumeGenerationResultDto?> GetGeneratedResumeAsync(Guid userId, Guid generatedResumeId)
    {
        var generated = await _context.GeneratedResumes
            .FirstOrDefaultAsync(g => g.Id == generatedResumeId && g.UserId == userId);

        if (generated == null) return null;

        return new ResumeGenerationResultDto
        {
            GeneratedResumeId = generated.Id,
            AnalysisId = generated.AnalysisId,
            TailoredContent = generated.PlainText,
            Status = "completed",
            CreatedAt = generated.GeneratedAt,
        };
    }
}
