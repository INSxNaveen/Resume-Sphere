using Microsoft.AspNetCore.Http;
using ResumeAPI.Models;
using System.Text.RegularExpressions;

namespace ResumeAPI.Services;

public class UploadModerationService : IUploadModerationService
{
    // Minimal heuristic blocks
    private static readonly string[] BannedKeywords = 
    {
        "porn", "xxx", "illegal", "exploit", "nude", "violence", "extremist", "terrorist", "scam", "fraud"
    };

    private static readonly string[] ResumeSections =
    {
        "experience", "education", "skills", "projects", "summary", "objective", "certifications", "work"
    };

    public async Task<ModerationResult> EvaluateAsync(IFormFile file, string extractedText)
    {
        var result = new ModerationResult();

        // 1. File Validation
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf" && ext != ".docx")
        {
            result.IsAllowed = false;
            result.Decision = "Blocked";
            result.Reason = "Invalid file extension. Only PDF and DOCX permitted.";
            // Not necessarily abusive, could be an honest mistake, so small risk increment
            result.RecommendedRiskIncrement = 5; 
            return result;
        }

        if (file.Length > 5 * 1024 * 1024)
        {
            result.IsAllowed = false;
            result.Decision = "Blocked";
            result.Reason = "File exceeds maximum size limit.";
            result.RecommendedRiskIncrement = 5;
            return result;
        }

        // 2. Extracted Text Moderation
        var textToLower = extractedText.ToLowerInvariant();
        
        // Blank file check
        if (string.IsNullOrWhiteSpace(textToLower))
        {
            result.IsAllowed = false;
            result.Decision = "Blocked";
            result.Reason = "File contains no readable text or is corrupted.";
            result.RecommendedRiskIncrement = 10;
            return result;
        }

        // Banned keywords check
        foreach (var keyword in BannedKeywords)
        {
            if (Regex.IsMatch(textToLower, $@"\b{Regex.Escape(keyword)}\b"))
            {
                result.IsAllowed = false;
                result.Decision = "Blocked";
                result.Reason = "File contains prohibited content violating safety policies.";
                result.RecommendedRiskIncrement = 50; // High penalty for abuse
                return result;
            }
        }

        // 3. Resume-Likeness Validation
        int sectionMatches = 0;
        foreach (var section in ResumeSections)
        {
            if (textToLower.Contains(section.ToLowerInvariant()))
            {
                sectionMatches++;
            }
        }

        // Needs at least some standard structural words to be considered a resume payload
        if (sectionMatches < 2 && textToLower.Length < 200)
        {
            result.IsAllowed = false;
            result.Decision = "Suspicious";
            result.Reason = "File does not appear to contain a structured resume.";
            result.RecommendedRiskIncrement = 20; 
            return result;
        }
        else if (sectionMatches == 0)
        {
            result.IsAllowed = false;
            result.Decision = "Suspicious";
            result.Reason = "No recognizable resume sections found.";
            result.RecommendedRiskIncrement = 20;
            return result;
        }

        // If it passes all layers
        result.IsAllowed = true;
        result.Decision = "Allowed";
        result.Reason = "Passed moderation rules.";
        result.RecommendedRiskIncrement = 0;

        return result;
    }
}
