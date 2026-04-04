================================================================================
       SMART RESUME MATCHER API — COMPLETE BACKEND CODE EXPLANATION
              (A Beginner-Friendly, Step-by-Step Guide)
================================================================================
Written for beginners who want to understand every piece of the backend,
then recreate it by reading this document and copy-pasting the code.
================================================================================
TABLE OF CONTENTS
================================================================================
1.  What Does This Project Do?
2.  Technology Stack & Prerequisites
3.  Project Folder Structure
4.  Step 1  — Project File (ResumeAPI.csproj)
5.  Step 2  — Configuration File (appsettings.json)
6.  Step 3  — Data Models (Models folder)
7.  Step 4  — Database Context (Data/AppDbContext.cs)
8.  Step 5  — DTOs — Data Transfer Objects (DTOs folder)
9.  Step 6  — Service Interfaces (Services/I*.cs)
10. Step 7  — Service Implementations (Services/*.cs)
11. Step 8  — API Controllers (Controllers folder)
12. Step 9  — Application Entry Point (Program.cs)
13. How Everything Connects (The Big Picture)
14. How to Run the Project
================================================================================
1. WHAT DOES THIS PROJECT DO?
================================================================================
This is a backend Web API built with ASP.NET Core 8. It lets users:
  1) UPLOAD a resume (PDF or DOCX file).
  2) EXTRACT skills from the resume text automatically.
  3) MATCH the resume against a database of jobs and rank them by relevance.
  4) ANALYZE SKILL GAPS — compare your resume skills vs. a specific job's
     required skills to see what you're missing.
  5) GET LEARNING RESOURCES — for any missing skill, get curated YouTube
     tutorials and article links to learn that skill.
Think of it as: Upload Resume → Extract Skills → Match Jobs → Find Gaps →
                Learn Missing Skills
================================================================================
2. TECHNOLOGY STACK & PREREQUISITES
================================================================================
Before you start, you need to install:
  • .NET 8 SDK           — https://dotnet.microsoft.com/download/dotnet/8.0
  • PostgreSQL            — https://www.postgresql.org/download/
  • A code editor         — Visual Studio or VS Code
  • (Optional) Postman    — to test API endpoints
NuGet Packages used (installed automatically via the .csproj file):
  • Npgsql.EntityFrameworkCore.PostgreSQL — PostgreSQL database driver
  • PdfPig                                — reads text from PDF files
  • DocumentFormat.OpenXml                — reads text from DOCX files
  • Swashbuckle.AspNetCore                — Swagger UI for testing APIs
  • Microsoft.EntityFrameworkCore.Design  — for database migrations
================================================================================
3. PROJECT FOLDER STRUCTURE
================================================================================
  ResumeAPI/
  ├── Controllers/                  ← API endpoints (HTTP routes)
  │   ├── ResumeController.cs       ← Upload resume, get skills
  │   ├── JobsController.cs         ← Match jobs, list all jobs
  │   ├── SkillGapController.cs     ← Compare resume vs job skills
  │   └── ResourcesController.cs    ← Get learning resources for a skill
  │
  ├── DTOs/                         ← Data Transfer Objects (API responses)
  │   ├── JobMatchRequest.cs        ← Input for job matching
  │   ├── JobMatchResult.cs         ← Output of job matching
  │   ├── ResumeUploadResponse.cs   ← Output after uploading resume
  │   ├── SkillGapResult.cs         ← Output of skill gap analysis
  │   └── ResourceResult.cs         ← Output of learning resources
  │
  ├── Data/                         ← Database configuration
  │   └── AppDbContext.cs           ← EF Core database context + seed data
  │
  ├── Models/                       ← Database table definitions
  │   ├── User.cs                   ← Users table
  │   ├── Resume.cs                 ← Resumes table
  │   ├── Job.cs                    ← Jobs table
  │   ├── Skill.cs                  ← Skills table
  │   └── JobSkill.cs               ← Many-to-many link: Job ↔ Skill
  │
  ├── Services/                     ← Business logic
  │   ├── IResumeParserService.cs   ← Interface: parse resume file
  │   ├── ResumeParserService.cs    ← Implementation: extract text from PDF/DOCX
  │   ├── ISkillExtractorService.cs ← Interface: extract skills from text
  │   ├── SkillExtractorService.cs  ← Implementation: keyword matching
  │   ├── IJobMatchService.cs       ← Interface: match skills to jobs
  │   ├── JobMatchService.cs        ← Implementation: scoring algorithm
  │   ├── ISkillGapService.cs       ← Interface: find missing skills
  │   ├── SkillGapService.cs        ← Implementation: gap analysis
  │   ├── ILearningResourceService.cs ← Interface: get learning links
  │   └── LearningResourceService.cs  ← Implementation: curated resource map
  │
  ├── Migrations/                   ← Auto-generated database migrations
  ├── Program.cs                    ← Application entry point (startup)
  ├── appsettings.json              ← Configuration (DB connection string)
  └── ResumeAPI.csproj              ← Project file (dependencies)
================================================================================
4. STEP 1 — PROJECT FILE (ResumeAPI.csproj)
================================================================================
WHAT IT DOES:
  This XML file tells .NET which SDK to use, which version of .NET to target,
  and which NuGet packages (libraries) to install.
LOGIC:
  • TargetFramework = net8.0 → We use .NET 8.
  • Nullable = enable → The compiler warns us about possible null values.
  • ImplicitUsings = enable → Common "using" statements are auto-included.
  • PackageReference entries → Each one installs a library we need.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="DocumentFormat.OpenXml" Version="3.3.0" />
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.20" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.11">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.11" />
    <PackageReference Include="PdfPig" Version="0.1.9" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
  </ItemGroup>
</Project>
─── END CODE ──────────────────────────────────────────────────────────────────
================================================================================
5. STEP 2 — CONFIGURATION FILE (appsettings.json)
================================================================================
WHAT IT DOES:
  Stores app settings. The most important one is the database connection string.
LOGIC:
  • "DefaultConnection" tells Entity Framework Core how to connect to your
    PostgreSQL database.
  • Host=localhost → database is on your computer.
  • Port=5432 → default PostgreSQL port.
  • Database=ResumeMatcherDb → the database name (EF Core creates it for you).
  • Username & Password → your PostgreSQL login credentials.
IMPORTANT: Change "Username" and "Password" to match YOUR PostgreSQL setup.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=ResumeMatcherDb;Username=postgres;Password=root"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
─── END CODE ──────────────────────────────────────────────────────────────────
================================================================================
6. STEP 3 — DATA MODELS (Models folder)
================================================================================
Models represent database TABLES. Each class = one table, each property = one
column. Entity Framework Core (EF Core) reads these classes and creates the
actual tables in PostgreSQL.
──────────────────────────────────
6a. Models/User.cs
──────────────────────────────────
WHAT IT DOES:
  Represents a user who uploads resumes.
LOGIC:
  • Id           → Primary key (auto-incremented by the database).
  • Name         → The user's name.
  • Email        → The user's email.
  • CreatedAt    → When the user was created (defaults to current UTC time).
  • Resumes      → Navigation property: one user can have MANY resumes.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
namespace ResumeAPI.Models;
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
}
─── END CODE ──────────────────────────────────────────────────────────────────
──────────────────────────────────
6b. Models/Resume.cs
──────────────────────────────────
WHAT IT DOES:
  Represents an uploaded resume file stored in the database.
LOGIC:
  • Id           → Primary key.
  • UserId       → Foreign key linking to User table (who uploaded it).
  • FileName     → Original file name (e.g., "john_resume.pdf").
  • RawText      → The full text extracted from the PDF/DOCX. This is what
                   we search through to find skills.
  • UploadedAt   → Timestamp of upload.
  • User?        → Navigation property back to the User who owns this resume.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
namespace ResumeAPI.Models;
public class Resume
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string RawText { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
}
─── END CODE ──────────────────────────────────────────────────────────────────
──────────────────────────────────
6c. Models/Skill.cs
──────────────────────────────────
WHAT IT DOES:
  Represents a technical skill (e.g., "Python", "React", "Docker").
LOGIC:
  • Id        → Primary key.
  • Name      → The skill name (must be unique in the database).
  • JobSkills → Navigation property: which jobs require this skill.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
namespace ResumeAPI.Models;
public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
─── END CODE ──────────────────────────────────────────────────────────────────
──────────────────────────────────
6d. Models/Job.cs
──────────────────────────────────
WHAT IT DOES:
  Represents a job listing with a title, company, and description.
LOGIC:
  • Id          → Primary key.
  • Title       → Job title (e.g., "Python Backend Developer").
  • Company     → Company name.
  • Description → Short description of the role.
  • JobSkills   → Navigation property: which skills this job requires
                  (linked through the JobSkill join table).
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
namespace ResumeAPI.Models;
public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
─── END CODE ──────────────────────────────────────────────────────────────────
──────────────────────────────────
6e. Models/JobSkill.cs
──────────────────────────────────
WHAT IT DOES:
  This is a JOIN TABLE for a many-to-many relationship between Job and Skill.
  One job can require MANY skills. One skill can belong to MANY jobs.
LOGIC:
  • JobId    → Foreign key to Job table.
  • Job?     → Navigation property to the related Job.
  • SkillId  → Foreign key to Skill table.
  • Skill?   → Navigation property to the related Skill.
  • The composite primary key is (JobId, SkillId) — defined in AppDbContext.
WHY DO WE NEED THIS?
  In relational databases, you can't directly have a "list" inside a row.
  Instead, you create a separate table (JobSkill) where each row says
  "Job #X requires Skill #Y". This is called a many-to-many relationship.
  Example rows in the JobSkill table:
    JobId=1, SkillId=1  → "Python Backend Developer" requires "Python"
    JobId=1, SkillId=6  → "Python Backend Developer" requires "SQL"
    JobId=2, SkillId=4  → "Full Stack Developer" requires "JavaScript"
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
namespace ResumeAPI.Models;
public class JobSkill
{
    public int JobId { get; set; }
    public Job? Job { get; set; }
    public int SkillId { get; set; }
    public Skill? Skill { get; set; }
}
─── END CODE ──────────────────────────────────────────────────────────────────
================================================================================
7. STEP 4 — DATABASE CONTEXT (Data/AppDbContext.cs)
================================================================================
WHAT IT DOES:
  AppDbContext is the "bridge" between your C# code and the PostgreSQL database.
  It tells Entity Framework Core:
    1) Which tables exist (via DbSet properties).
    2) How the tables relate to each other (via OnModelCreating).
    3) What initial data to put in the database (seed data).
LOGIC — LINE BY LINE:
  • DbSet<User> Users         → Creates a "Users" table from the User model.
  • DbSet<Resume> Resumes     → Creates a "Resumes" table.
  • DbSet<Skill> Skills       → Creates a "Skills" table.
  • DbSet<Job> Jobs           → Creates a "Jobs" table.
  • DbSet<JobSkill> JobSkills → Creates a "JobSkills" join table.
  OnModelCreating() configures:
  1) COMPOSITE KEY for JobSkill: The primary key is a combination of
     (JobId + SkillId), not a single Id column.
  2) RELATIONSHIPS:
     - JobSkill → Job: Each JobSkill row points to one Job.
     - JobSkill → Skill: Each JobSkill row points to one Skill.
     - Resume → User: Each Resume belongs to one User.
  3) UNIQUE INDEX on Skill.Name: No two skills can have the same name.
  4) SEED DATA: Pre-populates 30 skills, 10 jobs, and links between them.
  The seed data means your database is NOT empty when the app starts.
  It includes skills like Python, Java, React, Docker, etc., and jobs like
  "Python Backend Developer", "Data Scientist", etc.
─── COPY-PASTE CODE ───────────────────────────────────────────────────────────
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Models;
namespace ResumeAPI.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users => Set<User>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobSkill> JobSkills => Set<JobSkill>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // JobSkill composite key
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
        // Unique skill name
        modelBuilder.Entity<Skill>()
            .HasIndex(s => s.Name)
            .IsUnique();
        // Resume -> User FK
        modelBuilder.Entity<Resume>()
            .HasOne(r => r.User)
            .WithMany(u => u.Resumes)
            .HasForeignKey(r => r.UserId);
        // ─── Seed Skills ─────────────────────────────────────────────────
        modelBuilder.Entity<Skill>().HasData(
            new Skill { Id = 1,  Name = "Python" },
            new Skill { Id = 2,  Name = "Java" },
            new Skill { Id = 3,  Name = "C#" },
            new Skill { Id = 4,  Name = "JavaScript" },
            new Skill { Id = 5,  Name = "TypeScript" },
            new Skill { Id = 6,  Name = "SQL" },
            new Skill { Id = 7,  Name = "PostgreSQL" },
            new Skill { Id = 8,  Name = "MySQL" },
            new Skill { Id = 9,  Name = "MongoDB" },
            new Skill { Id = 10, Name = "React" },
            new Skill { Id = 11, Name = "Angular" },
            new Skill { Id = 12, Name = "Vue" },
            new Skill { Id = 13, Name = "Node.js" },
            new Skill { Id = 14, Name = ".NET" },
            new Skill { Id = 15, Name = "ASP.NET Core" },
            new Skill { Id = 16, Name = "Machine Learning" },
            new Skill { Id = 17, Name = "Deep Learning" },
            new Skill { Id = 18, Name = "TensorFlow" },
            new Skill { Id = 19, Name = "PyTorch" },
            new Skill { Id = 20, Name = "Docker" },
            new Skill { Id = 21, Name = "Kubernetes" },
            new Skill { Id = 22, Name = "Git" },
            new Skill { Id = 23, Name = "REST API" },
            new Skill { Id = 24, Name = "GraphQL" },
            new Skill { Id = 25, Name = "AWS" },
            new Skill { Id = 26, Name = "Azure" },
            new Skill { Id = 27, Name = "Linux" },
            new Skill { Id = 28, Name = "Data Analysis" },
            new Skill { Id = 29, Name = "Pandas" },
            new Skill { Id = 30, Name = "Scikit-learn" }
        );
        // ─── Seed Jobs ──────────────────────────────────────────────────
        modelBuilder.Entity<Job>().HasData(
            new Job { Id = 1,  Title = "Python Backend Developer",     Company = "TechCorp",       Description = "Build scalable Python APIs." },
            new Job { Id = 2,  Title = "Full Stack Developer",         Company = "WebSolutions",   Description = "Frontend + backend web development." },
            new Job { Id = 3,  Title = "Data Scientist",               Company = "DataLabs",       Description = "ML model building and data analysis." },
            new Job { Id = 4,  Title = "DevOps Engineer",              Company = "CloudOps",       Description = "CI/CD, infrastructure, and cloud." },
            new Job { Id = 5,  Title = ".NET Developer",               Company = "EnterpriseSoft", Description = "Enterprise application development with .NET." },
            new Job { Id = 6,  Title = "Frontend React Developer",     Company = "UIStudio",       Description = "Build modern React UIs." },
            new Job { Id = 7,  Title = "Database Administrator",       Company = "DBMasters",      Description = "Manage and optimize databases." },
            new Job { Id = 8,  Title = "Machine Learning Engineer",    Company = "AI Dynamics",    Description = "Deploy and tune ML models." },
            new Job { Id = 9,  Title = "Cloud Solutions Architect",    Company = "SkyArch",        Description = "Design cloud-native architectures." },
            new Job { Id = 10, Title = "Java Microservices Developer", Company = "MicroTech",      Description = "Build Java-based microservices." }
        );
        // ─── Seed JobSkills (which job needs which skill) ───────────────
        modelBuilder.Entity<JobSkill>().HasData(
            // Job 1: Python Backend Developer → Python, SQL, PostgreSQL, REST API, Git, Docker
            new JobSkill { JobId = 1, SkillId = 1  },
            new JobSkill { JobId = 1, SkillId = 6  },
            new JobSkill { JobId = 1, SkillId = 7  },
            new JobSkill { JobId = 1, SkillId = 23 },
            new JobSkill { JobId = 1, SkillId = 22 },
            new JobSkill { JobId = 1, SkillId = 20 },
            // Job 2: Full Stack Developer → JavaScript, TypeScript, React, Node.js, SQL, Git, REST API
            new JobSkill { JobId = 2, SkillId = 4  },
            new JobSkill { JobId = 2, SkillId = 5  },
            new JobSkill { JobId = 2, SkillId = 10 },
            new JobSkill { JobId = 2, SkillId = 13 },
            new JobSkill { JobId = 2, SkillId = 6  },
            new JobSkill { JobId = 2, SkillId = 22 },
            new JobSkill { JobId = 2, SkillId = 23 },
            // Job 3: Data Scientist → Python, ML, DL, Data Analysis, Pandas, Scikit-learn, SQL
            new JobSkill { JobId = 3, SkillId = 1  },
            new JobSkill { JobId = 3, SkillId = 16 },
            new JobSkill { JobId = 3, SkillId = 17 },
            new JobSkill { JobId = 3, SkillId = 28 },
            new JobSkill { JobId = 3, SkillId = 29 },
            new JobSkill { JobId = 3, SkillId = 30 },
            new JobSkill { JobId = 3, SkillId = 6  },
            // Job 4: DevOps Engineer → Docker, Kubernetes, AWS, Linux, Git
            new JobSkill { JobId = 4, SkillId = 20 },
            new JobSkill { JobId = 4, SkillId = 21 },
            new JobSkill { JobId = 4, SkillId = 25 },
            new JobSkill { JobId = 4, SkillId = 27 },
            new JobSkill { JobId = 4, SkillId = 22 },
            // Job 5: .NET Developer → C#, .NET, ASP.NET Core, SQL, PostgreSQL, REST API, Git
            new JobSkill { JobId = 5, SkillId = 3  },
            new JobSkill { JobId = 5, SkillId = 14 },
            new JobSkill { JobId = 5, SkillId = 15 },
            new JobSkill { JobId = 5, SkillId = 6  },
            new JobSkill { JobId = 5, SkillId = 7  },
            new JobSkill { JobId = 5, SkillId = 23 },
            new JobSkill { JobId = 5, SkillId = 22 },
            // Job 6: Frontend React Developer → JavaScript, TypeScript, React, Git
            new JobSkill { JobId = 6, SkillId = 4  },
            new JobSkill { JobId = 6, SkillId = 5  },
            new JobSkill { JobId = 6, SkillId = 10 },
            new JobSkill { JobId = 6, SkillId = 22 },
            // Job 7: Database Administrator → SQL, PostgreSQL, MySQL, MongoDB
            new JobSkill { JobId = 7, SkillId = 6  },
            new JobSkill { JobId = 7, SkillId = 7  },
            new JobSkill { JobId = 7, SkillId = 8  },
            new JobSkill { JobId = 7, SkillId = 9  },
            // Job 8: Machine Learning Engineer → Python, ML, TensorFlow, PyTorch, Docker, Git
            new JobSkill { JobId = 8, SkillId = 1  },
            new JobSkill { JobId = 8, SkillId = 16 },
            new JobSkill { JobId = 8, SkillId = 18 },
            new JobSkill { JobId = 8, SkillId = 19 },
            new JobSkill { JobId = 8, SkillId = 20 },
            new JobSkill { JobId = 8, SkillId = 22 },
            // Job 9: Cloud Solutions Architect → AWS, Azure, Docker, Kubernetes, Linux
            new JobSkill { JobId = 9, SkillId = 25 },
            new JobSkill { JobId = 9, SkillId = 26 },
            new JobSkill { JobId = 9, SkillId = 20 },
            new JobSkill { JobId = 9, SkillId = 21 },
            new JobSkill { JobId = 9, SkillId = 27 },
            // Job 10: Java Microservices Developer → Java, SQL, REST API, Docker, GraphQL, Git
            new JobSkill { JobId = 10, SkillId = 2  },
            new JobSkill { JobId = 10, SkillId = 6  },
            new JobSkill { JobId = 10, SkillId = 23 },
            new JobSkill { JobId = 10, SkillId = 20 },
            new JobSkill { JobId = 10, SkillId = 24 },
            new JobSkill { JobId = 10, SkillId = 22 }
        );
    }
}
─── END CODE ──────────────────────────────────────────────────────────────────
