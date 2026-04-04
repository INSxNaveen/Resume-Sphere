using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using System.Text.Json;

namespace ResumeAPI.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly IJobService _jobService;

    public DashboardService(AppDbContext context, IJobService jobService)
    {
        _context = context;
        _jobService = jobService;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Resumes)
            .Include(u => u.Analyses)
            .Include(u => u.CourseProgresses)
                .ThenInclude(p => p.CourseRecommendation)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new ArgumentException("User not found.");

        var hasUploadedResume = user.Resumes.Any();
        var completedAnalyses = user.Analyses
            .Where(a => a.Status == "completed")
            .OrderByDescending(a => a.CreatedAt)
            .ToList();
        var hasCompletedAnalysis = completedAnalyses.Any();

        string userStatus = "new";
        if (hasCompletedAnalysis) userStatus = "analyzed";
        else if (hasUploadedResume) userStatus = "resume_ready";

        DashboardAnalysisSnapshot? latestAnalysisSnapshot = null;

        if (hasCompletedAnalysis)
        {
            var latestAnalysis = completedAnalyses.First();

            var eligibleJobs = string.IsNullOrWhiteSpace(latestAnalysis.EligibleJobsJson)
                ? new List<EligibleJobDto>()
                : JsonSerializer.Deserialize<List<EligibleJobDto>>(latestAnalysis.EligibleJobsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<EligibleJobDto>();

            var currentSkills = string.IsNullOrWhiteSpace(latestAnalysis.CurrentSkillsJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(latestAnalysis.CurrentSkillsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<string>();

            var category = DetectResumeCategory(currentSkills);
            
            // Enrich jobs if needed (e.g. if the list is too short or lacks descriptions)
            eligibleJobs = EnrichJobs(eligibleJobs, category);

            // Generate assistant messages
            var messages = GenerateAssistantMessages(user.FullName ?? "User", category, currentSkills, eligibleJobs, latestAnalysis);

            latestAnalysisSnapshot = new DashboardAnalysisSnapshot
            {
                AnalysisId = latestAnalysis.Id,
                CompletedAt = latestAnalysis.CreatedAt,
                AssistantMessages = messages,
                TopSkills = currentSkills.Take(5).ToList(),
                MissingSkills = eligibleJobs.SelectMany(j => j.MissingSkills ?? new List<string>()).Distinct().Take(4).ToList(),
                TopRecommendedJobs = eligibleJobs.OrderByDescending(j => j.MatchScore).Take(4).ToList(),
                ResumeCategory = category
            };
        }

        var recentLearning = user.CourseProgresses
            .OrderByDescending(p => p.LastUpdatedAt ?? p.StartedAt ?? DateTime.MinValue)
            .Take(3)
            .Select(p => new LearningProgressDto
            {
                CourseTitle = p.CourseRecommendation?.FreeResourceTitle ?? "Unknown Course",
                SkillName = p.CourseRecommendation?.SkillName ?? "Unknown Skill",
                PercentComplete = p.PercentComplete,
                Status = p.Status
            })
            .ToList();

        // 100% REAL DATA FETCHING
        var detectedCategory = latestAnalysisSnapshot?.ResumeCategory ?? "Technology";
        var topSkill = latestAnalysisSnapshot?.TopSkills?.FirstOrDefault();
        
        var realRecommendedJobs = await _jobService.SearchJobsAsync(topSkill ?? detectedCategory, null, 6);
        var realCompanies = await _jobService.GetFeaturedCompaniesAsync(detectedCategory);

        return new DashboardSummaryDto
        {
            UserFirstName = user.FullName?.Split(' ').FirstOrDefault() ?? "User",
            HasUploadedResume = hasUploadedResume,
            HasCompletedAnalysis = hasCompletedAnalysis,
            UserStatus = userStatus,
            LatestAnalysis = latestAnalysisSnapshot,
            RecentLearning = recentLearning,
            ActivityRecommendedJobs = realRecommendedJobs,
            FeaturedCompanies = realCompanies
        };
    }

    private string DetectResumeCategory(List<string> skills)
    {
        var skillString = string.Join(" ", skills).ToLowerInvariant();

        if (skillString.Contains("java") || skillString.Contains("spring") || skillString.Contains("hibernate"))
        {
            return "Java Backend";
        }
        
        if (skillString.Contains("ai") || skillString.Contains("openai") || (skillString.Contains("react") && skillString.Contains("node")))
        {
            return "Full Stack with AI";
        }

        if (skillString.Contains("html") || skillString.Contains("css") || skillString.Contains("designer"))
        {
            return "Frontend (HTML/CSS)";
        }

        return "Full Stack with AI"; // Default to most premium category
    }

    private List<EligibleJobDto> EnrichJobs(List<EligibleJobDto> jobs, string category)
    {
        if (jobs == null) jobs = new List<EligibleJobDto>();

        // If we have less than 2 jobs, or they are very sparse, seed from templates
        if (jobs.Count < 2)
        {
            var templates = GetTemplatesForCategory(category);
            foreach (var t in templates)
            {
                if (!jobs.Any(j => j.Title.Contains(t.Title)))
                {
                    jobs.Add(t);
                }
            }
        }
        
        // Ensure all jobs have match scores if missing
        foreach(var j in jobs) {
            if (j.MatchScore == 0) j.MatchScore = 85; 
        }

        return jobs;
    }

    private List<EligibleJobDto> GetTemplatesForCategory(string category)
    {
        return category switch
        {
            "Full Stack with AI" => new List<EligibleJobDto>
            {
                new EligibleJobDto { Title = "Full Stack AI Developer", MatchScore = 94, FitReason = "Your expertise in modern web stacks and AI integration is a perfect match." },
                new EligibleJobDto { Title = "Generative AI Engineer", MatchScore = 88, FitReason = "Great fit for building next-gen user experiences with LLMs." },
                new EligibleJobDto { Title = "Junior AI Product Engineer", MatchScore = 82, FitReason = "Ideal role for bridging the gap between product and AI logic." }
            },
            "Java Backend" => new List<EligibleJobDto>
            {
                new EligibleJobDto { Title = "Java Backend Developer", MatchScore = 92, FitReason = "Your strong foundation in Java and enterprise patterns is exactly what's needed." },
                new EligibleJobDto { Title = "Spring Boot Specialist", MatchScore = 89, FitReason = "High match for building scalable microservices and RESTful APIs." },
                new EligibleJobDto { Title = "Backend Systems Engineer", MatchScore = 85, FitReason = "Focus on database optimization and system architecture." }
            },
            "Frontend (HTML/CSS)" => new List<EligibleJobDto>
            {
                new EligibleJobDto { Title = "Junior Frontend Intern", MatchScore = 95, FitReason = "Your clean HTML/CSS skills are ideal for starting a web development career." },
                new EligibleJobDto { Title = "Web Designer Trainee", MatchScore = 90, FitReason = "Focus on responsive designs and user interfaces." },
                new EligibleJobDto { Title = "HTML/CSS Developer", MatchScore = 88, FitReason = "Perfect role for building professional-grade static and interactive sites." }
            },
            _ => new List<EligibleJobDto>()
        };
    }

    private List<string> GenerateAssistantMessages(string name, string category, List<string> skills, List<EligibleJobDto> jobs, Models.Analysis latest)
    {
        var messages = new List<string>();
        var firstName = name.Split(' ').First();

        messages.Add($"Hello {firstName}! Based on your profile, you're tracking as a **{category}**.");

        var topJob = jobs.OrderByDescending(j => j.MatchScore).FirstOrDefault();
        if (topJob != null)
        {
            messages.Add($"You're a strong match for **{topJob.Title}** roles right now.");
        }

        if (skills != null && skills.Any())
        {
            var topSkill = skills.First();
            messages.Add($"I've highlighted **{topSkill}** as one of your standout strengths.");
        }

        switch (category)
        {
            case "Full Stack with AI":
                messages.Add("Boost your career further by mastering advanced prompt engineering and agentic workflows.");
                break;
            case "Java Backend":
                messages.Add("Consider learning microservices architectural patterns and Kubernetes to stand out.");
                break;
            case "Frontend (HTML/CSS)":
                messages.Add("Your next logical step is mastering a framework like React or Vue to triple your opportunities.");
                break;
        }

        return messages.Take(3).ToList();
    }
}
