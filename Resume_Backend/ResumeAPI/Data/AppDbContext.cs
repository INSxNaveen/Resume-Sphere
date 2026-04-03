using Microsoft.EntityFrameworkCore;
using ResumeAPI.Models;

namespace ResumeAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── Core Tables ────────────────────────────────────────────────────────────
    public DbSet<User> Users => Set<User>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<JobDescription> JobDescriptions => Set<JobDescription>();
    public DbSet<Analysis> Analyses => Set<Analysis>();

    // ── Skill Extraction ───────────────────────────────────────────────────────
    public DbSet<ResumeExtractedSkill> ResumeExtractedSkills => Set<ResumeExtractedSkill>();
    public DbSet<JobDescriptionExtractedSkill> JobDescriptionExtractedSkills => Set<JobDescriptionExtractedSkill>();

    // ── Analysis Outputs ───────────────────────────────────────────────────────
    public DbSet<AnalysisMissingSkill> AnalysisMissingSkills => Set<AnalysisMissingSkill>();
    public DbSet<AnalysisMissingKeyword> AnalysisMissingKeywords => Set<AnalysisMissingKeyword>();
    public DbSet<AnalysisSuggestion> AnalysisSuggestions => Set<AnalysisSuggestion>();

    // ── Learning & Progress ────────────────────────────────────────────────────
    public DbSet<CourseRecommendation> CourseRecommendations => Set<CourseRecommendation>();
    public DbSet<UserCourseSelection> UserCourseSelections => Set<UserCourseSelection>();
    public DbSet<UserCourseProgress> UserCourseProgresses => Set<UserCourseProgress>();

    // ── Generated Content ──────────────────────────────────────────────────────
    public DbSet<GeneratedResume> GeneratedResumes => Set<GeneratedResume>();
    public DbSet<AnalysisHistory> AnalysisHistories => Set<AnalysisHistory>();

    // ── Legacy (kept for backward compat, not part of new feature set) ─────────
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobSkill> JobSkills => Set<JobSkill>();

    // ── Moderation & Abuse ─────────────────────────────────────────────────────
    public DbSet<UploadModerationEvent> UploadModerationEvents => Set<UploadModerationEvent>();
    public DbSet<BlockedDevice> BlockedDevices => Set<BlockedDevice>();
    public DbSet<BlockedIp> BlockedIps => Set<BlockedIp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ══════════════════════════════════════════════════════════════════════════
        // USER
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            // DATA RULE 1: Unique index on Email — enforced at DB & EF level
            entity.HasIndex(u => u.Email)
                .IsUnique()
                .HasDatabaseName("IX_Users_Email");

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.FullName)
                .HasMaxLength(256);

            entity.Property(u => u.CreatedAt)
                .HasDefaultValueSql("NOW()");
        });

        // ══════════════════════════════════════════════════════════════════════════
        // RESUME
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.FileName).HasMaxLength(512);
            entity.Property(r => r.FileType).HasMaxLength(10);
            entity.Property(r => r.UploadedAt).HasDefaultValueSql("NOW()");

            entity.HasOne(r => r.User)
                .WithMany(u => u.Resumes)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // JOB DESCRIPTION
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<JobDescription>(entity =>
        {
            entity.HasKey(jd => jd.Id);

            entity.Property(jd => jd.RoleTitle).IsRequired().HasMaxLength(256);
            entity.Property(jd => jd.CompanyName).HasMaxLength(256);
            entity.Property(jd => jd.ExperienceLevel).HasMaxLength(128);
            entity.Property(jd => jd.CreatedAt).HasDefaultValueSql("NOW()");

            entity.HasOne(jd => jd.User)
                .WithMany(u => u.JobDescriptions)
                .HasForeignKey(jd => jd.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // ANALYSIS
        // DATA RULE 6: Always linked to both ResumeId and JobDescriptionId
        // DATA RULE 4: ScoreBreakdownJson stored as JSONB — never recomputed on load
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<Analysis>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.OverallScore).HasColumnType("decimal(5,2)");
            entity.Property(a => a.Status).IsRequired().HasMaxLength(32);
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("NOW()");

            // DATA RULE 4 — JSON columns stored as PostgreSQL JSONB
            entity.Property(a => a.ScoreBreakdownJson)
                .HasColumnType("jsonb")
                .HasDefaultValue("{}");

            entity.Property(a => a.DeductionReasonsJson)
                .HasColumnType("jsonb")
                .HasDefaultValue("[]");

            // DATA RULE 6 — Required FKs
            entity.Property(a => a.ResumeId).IsRequired();
            entity.Property(a => a.JobDescriptionId).IsRequired();

            entity.HasOne(a => a.User)
                .WithMany(u => u.Analyses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Resume)
                .WithMany(r => r.Analyses)
                .HasForeignKey(a => a.ResumeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.JobDescription)
                .WithMany(jd => jd.Analyses)
                .HasForeignKey(a => a.JobDescriptionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // RESUME EXTRACTED SKILLS
        // DATA RULE 3: SkillName stored normalized
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<ResumeExtractedSkill>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.SkillName).IsRequired().HasMaxLength(256);
            entity.Property(s => s.Section).HasMaxLength(128);
            entity.Property(s => s.Confidence).HasColumnType("decimal(4,3)");

            entity.HasOne(s => s.Resume)
                .WithMany(r => r.ExtractedSkills)
                .HasForeignKey(s => s.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Analysis)
                .WithMany(a => a.ResumeExtractedSkills)
                .HasForeignKey(s => s.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // JOB DESCRIPTION EXTRACTED SKILLS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<JobDescriptionExtractedSkill>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.SkillName).IsRequired().HasMaxLength(256);
            entity.Property(s => s.Priority).HasMaxLength(32);

            entity.HasOne(s => s.JobDescription)
                .WithMany(jd => jd.ExtractedSkills)
                .HasForeignKey(s => s.JobDescriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Analysis)
                .WithMany(a => a.JdExtractedSkills)
                .HasForeignKey(s => s.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // ANALYSIS MISSING SKILLS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<AnalysisMissingSkill>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.SkillName).IsRequired().HasMaxLength(256);
            entity.Property(s => s.Priority).HasMaxLength(32);
            entity.Property(s => s.Decision).HasMaxLength(32);

            entity.HasOne(s => s.Analysis)
                .WithMany(a => a.MissingSkills)
                .HasForeignKey(s => s.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // ANALYSIS MISSING KEYWORDS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<AnalysisMissingKeyword>(entity =>
        {
            entity.HasKey(k => k.Id);

            entity.Property(k => k.Keyword).IsRequired().HasMaxLength(256);

            entity.HasOne(k => k.Analysis)
                .WithMany(a => a.MissingKeywords)
                .HasForeignKey(k => k.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // ANALYSIS SUGGESTIONS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<AnalysisSuggestion>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.Type).IsRequired().HasMaxLength(64);

            entity.HasOne(s => s.Analysis)
                .WithMany(a => a.Suggestions)
                .HasForeignKey(s => s.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // COURSE RECOMMENDATIONS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<CourseRecommendation>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.SkillName).IsRequired().HasMaxLength(256);
            entity.Property(c => c.Priority).HasMaxLength(32);
            entity.Property(c => c.Difficulty).HasMaxLength(32);
            entity.Property(c => c.WhyItMatters).HasMaxLength(1024);
            entity.Property(c => c.FreeResourceTitle).HasMaxLength(512);
            entity.Property(c => c.FreeResourceUrl).HasMaxLength(2048);
            entity.Property(c => c.PaidResourceTitle).HasMaxLength(512);
            entity.Property(c => c.PaidResourceUrl).HasMaxLength(2048);

            entity.HasOne(c => c.Analysis)
                .WithMany(a => a.CourseRecommendations)
                .HasForeignKey(c => c.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // USER COURSE SELECTIONS
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<UserCourseSelection>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.SelectedAt).HasDefaultValueSql("NOW()");

            entity.HasOne(s => s.User)
                .WithMany(u => u.CourseSelections)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.CourseRecommendation)
                .WithMany(c => c.UserSelections)
                .HasForeignKey(s => s.CourseRecommendationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // USER COURSE PROGRESS
        // DATA RULE 5: No seeded/random values — only real user-driven updates
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<UserCourseProgress>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Status).IsRequired().HasMaxLength(32);

            // PercentComplete is validated 0–100 via a check constraint
            entity.ToTable("UserCourseProgress", t => t.HasCheckConstraint(
                "CK_UserCourseProgress_PercentComplete",
                "\"PercentComplete\" >= 0 AND \"PercentComplete\" <= 100"));

            entity.HasOne(p => p.User)
                .WithMany(u => u.CourseProgresses)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.CourseRecommendation)
                .WithMany(c => c.UserProgresses)
                .HasForeignKey(p => p.CourseRecommendationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // GENERATED RESUMES
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<GeneratedResume>(entity =>
        {
            entity.HasKey(g => g.Id);

            entity.Property(g => g.RoleTitle).HasMaxLength(256);
            entity.Property(g => g.GeneratedAt).HasDefaultValueSql("NOW()");

            // ContentJson stored as JSONB
            entity.Property(g => g.ContentJson)
                .HasColumnType("jsonb")
                .HasDefaultValue("{}");

            entity.HasOne(g => g.User)
                .WithMany(u => u.GeneratedResumes)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(g => g.Analysis)
                .WithMany(a => a.GeneratedResumes)
                .HasForeignKey(g => g.AnalysisId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // ANALYSIS HISTORY
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<AnalysisHistory>(entity =>
        {
            entity.HasKey(h => h.Id);

            entity.Property(h => h.EventType).IsRequired().HasMaxLength(64);
            entity.Property(h => h.OccurredAt).HasDefaultValueSql("NOW()");

            entity.HasOne(h => h.User)
                .WithMany(u => u.AnalysisHistories)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(h => h.Analysis)
                .WithMany(a => a.AnalysisHistories)
                .HasForeignKey(h => h.AnalysisId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════════════════════
        // LEGACY — Skill / Job / JobSkill (kept for backward compat, no seed data)
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<JobSkill>()
            .HasKey(js => new { js.JobId, js.SkillId });

        modelBuilder.Entity<JobSkill>()
            .HasOne(js => js.Job)
            .WithMany(j => j.JobSkills)
            .HasForeignKey(js => js.JobId);

        modelBuilder.Entity<JobSkill>()
            .HasOne(js => js.Skill)
            .WithMany(s => s.JobSkills)
            .HasForeignKey(js => js.SkillId);

        modelBuilder.Entity<Skill>()
            .HasIndex(s => s.Name)
            .IsUnique();

        // ══════════════════════════════════════════════════════════════════════════
        // MODERATION & ABUSE
        // ══════════════════════════════════════════════════════════════════════════
        modelBuilder.Entity<UploadModerationEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.ModerationEvents)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull); // Allow moderation events to persist if user is deleted, or use Cascade based on preference. Setting to Cascade might lose evidence. Let's use Cascade for simplicity.
        });

        // Let's change the above SetNull to Cascade since UserId is nullable, let's just make it SetNull if it's nullable. Actually I'll just change the config to OnDelete(SetNull), but EF Core might complain if we aren't careful. Let's just use SetNull since we made UserId nullable.
        
        modelBuilder.Entity<BlockedDevice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.DeviceHash).IsUnique(); 
        });

        modelBuilder.Entity<BlockedIp>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.IpAddress).IsUnique();
        });
    }
}
