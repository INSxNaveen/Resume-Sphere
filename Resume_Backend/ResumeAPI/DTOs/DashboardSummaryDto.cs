using System.Text.Json.Serialization;

namespace ResumeAPI.DTOs;

public class DashboardSummaryDto 
{
    public string UserFirstName { get; set; } = string.Empty;
    public bool HasUploadedResume { get; set; }
    public bool HasCompletedAnalysis { get; set; }
    
    /// <summary>
    /// Status of the user journey: "new", "resume_ready", or "analyzed".
    /// </summary>
    public string UserStatus { get; set; } = "new";
    public DashboardAnalysisSnapshot? LatestAnalysis { get; set; }
    public List<LearningProgressDto> RecentLearning { get; set; } = new();
    
    // LIVE DATA (Section B & D)
    public List<JobDto> ActivityRecommendedJobs { get; set; } = new();
    public List<CompanyDto> FeaturedCompanies { get; set; } = new();
}

public class DashboardAnalysisSnapshot
{
    public Guid AnalysisId { get; set; }
    public DateTime CompletedAt { get; set; }
    
    /// <summary>
    /// 2-3 short chat-style assistant insights/messages.
    /// </summary>
    public List<string> AssistantMessages { get; set; } = new();
    
    public List<string> TopSkills { get; set; } = new();
    public List<string> MissingSkills { get; set; } = new();
    public List<EligibleJobDto> TopRecommendedJobs { get; set; } = new();
    
    /// <summary>
    /// Inferred category: "Full Stack with AI", "Java Backend", or "Frontend (HTML/CSS)".
    /// </summary>
    public string ResumeCategory { get; set; } = "Unknown";
}

public class LearningProgressDto
{
    public string CourseTitle { get; set; } = string.Empty;
    public string SkillName { get; set; } = string.Empty;
    public int PercentComplete { get; set; }
    public string Status { get; set; } = "not_started";
}
