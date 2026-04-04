#!/usr/bin/env dotnet-script
// Fix partial EF migration: insert the history record + create any missing tables
// Usage: dotnet script fix_migration.csx

#r "nuget: Npgsql, 8.0.1"

using Npgsql;

var conn = new NpgsqlConnection("Host=localhost;Port=5432;Database=ResumeMatcherDb;Username=postgres;Password=root");
await conn.OpenAsync();

Console.WriteLine("Connected to PostgreSQL");

// 1. Check which tables exist
var existingTables = new HashSet<string>();
await using (var cmd = new NpgsqlCommand(@"SELECT tablename FROM pg_tables WHERE schemaname='public'", conn))
await using (var rd = await cmd.ExecuteReaderAsync())
{
    while (await rd.ReadAsync()) existingTables.Add(rd.GetString(0));
}
Console.WriteLine($"Existing tables: {string.Join(", ", existingTables.OrderBy(x => x))}");

// 2. Check migration history
var appliedMigrations = new HashSet<string>();
await using (var cmd = new NpgsqlCommand(@"SELECT ""MigrationId"" FROM ""__EFMigrationsHistory""", conn))
await using (var rd = await cmd.ExecuteReaderAsync())
{
    while (await rd.ReadAsync()) appliedMigrations.Add(rd.GetString(0));
}
Console.WriteLine($"Applied migrations: {string.Join(", ", appliedMigrations.OrderBy(x => x))}");

// 3. Check Users columns
Console.WriteLine("\nUsers columns:");
await using (var cmd = new NpgsqlCommand(@"SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Users' ORDER BY ordinal_position", conn))
await using (var rd = await cmd.ExecuteReaderAsync())
{
    while (await rd.ReadAsync()) Console.WriteLine($"  {rd.GetString(0)}: {rd.GetString(1)}");
}

// 4. If migration not in history, insert it
var migrationId = "20260325090622_AddFullResumeSphereSchema";
if (!appliedMigrations.Contains(migrationId))
{
    Console.WriteLine($"\nInserting migration record: {migrationId}");
    await using var cmd = new NpgsqlCommand(
        @"INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"") VALUES (@id, @ver)",
        conn);
    cmd.Parameters.AddWithValue("id", migrationId);
    cmd.Parameters.AddWithValue("ver", "8.0.0");
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Migration record inserted.");
}
else
{
    Console.WriteLine($"\nMigration {migrationId} already in history.");
}

// 5. Create any missing tables
var createStatements = new Dictionary<string, string>
{
    ["JobDescriptions"] = @"
        CREATE TABLE IF NOT EXISTS ""JobDescriptions"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""RawText"" text NOT NULL DEFAULT '',
            ""NormalizedText"" text NOT NULL DEFAULT '',
            ""RoleTitle"" character varying(256) NOT NULL DEFAULT '',
            ""CompanyName"" character varying(256),
            ""ExperienceLevel"" character varying(128),
            ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT ""PK_JobDescriptions"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_JobDescriptions_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE
        )",
    ["Analyses"] = @"
        CREATE TABLE IF NOT EXISTS ""Analyses"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""ResumeId"" uuid NOT NULL,
            ""JobDescriptionId"" uuid NOT NULL,
            ""OverallScore"" numeric(5,2) NOT NULL DEFAULT 0,
            ""ScoreBreakdownJson"" jsonb NOT NULL DEFAULT '{}',
            ""Status"" character varying(32) NOT NULL DEFAULT 'Pending',
            ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT ""PK_Analyses"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_Analyses_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE,
            CONSTRAINT ""FK_Analyses_Resumes_ResumeId"" FOREIGN KEY (""ResumeId"")
                REFERENCES ""Resumes"" (""Id"") ON DELETE RESTRICT,
            CONSTRAINT ""FK_Analyses_JobDescriptions_JobDescriptionId"" FOREIGN KEY (""JobDescriptionId"")
                REFERENCES ""JobDescriptions"" (""Id"") ON DELETE RESTRICT
        )",
    ["ResumeExtractedSkills"] = @"
        CREATE TABLE IF NOT EXISTS ""ResumeExtractedSkills"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""ResumeId"" uuid NOT NULL,
            ""SkillName"" character varying(256) NOT NULL DEFAULT '',
            ""Confidence"" numeric(4,3) NOT NULL DEFAULT 1,
            CONSTRAINT ""PK_ResumeExtractedSkills"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_ResumeExtractedSkills_Resumes_ResumeId"" FOREIGN KEY (""ResumeId"")
                REFERENCES ""Resumes"" (""Id"") ON DELETE CASCADE
        )",
    ["JobDescriptionExtractedSkills"] = @"
        CREATE TABLE IF NOT EXISTS ""JobDescriptionExtractedSkills"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""JobDescriptionId"" uuid NOT NULL,
            ""SkillName"" character varying(256) NOT NULL DEFAULT '',
            ""IsRequired"" boolean NOT NULL DEFAULT true,
            CONSTRAINT ""PK_JobDescriptionExtractedSkills"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_JobDescriptionExtractedSkills_JobDescriptions_JobDescriptionId"" FOREIGN KEY (""JobDescriptionId"")
                REFERENCES ""JobDescriptions"" (""Id"") ON DELETE CASCADE
        )",
    ["AnalysisMissingSkills"] = @"
        CREATE TABLE IF NOT EXISTS ""AnalysisMissingSkills"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""AnalysisId"" uuid NOT NULL,
            ""SkillName"" character varying(256) NOT NULL DEFAULT '',
            ""Priority"" character varying(32) NOT NULL DEFAULT 'Medium',
            ""WhyItMatters"" text NOT NULL DEFAULT '',
            ""Decision"" character varying(32) NOT NULL DEFAULT 'Pending',
            CONSTRAINT ""PK_AnalysisMissingSkills"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_AnalysisMissingSkills_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE CASCADE
        )",
    ["AnalysisMissingKeywords"] = @"
        CREATE TABLE IF NOT EXISTS ""AnalysisMissingKeywords"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""AnalysisId"" uuid NOT NULL,
            ""Keyword"" character varying(256) NOT NULL DEFAULT '',
            ""WhereItMatters"" text NOT NULL DEFAULT '',
            CONSTRAINT ""PK_AnalysisMissingKeywords"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_AnalysisMissingKeywords_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE CASCADE
        )",
    ["AnalysisSuggestions"] = @"
        CREATE TABLE IF NOT EXISTS ""AnalysisSuggestions"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""AnalysisId"" uuid NOT NULL,
            ""Type"" character varying(64) NOT NULL DEFAULT '',
            ""OriginalText"" text NOT NULL DEFAULT '',
            ""SuggestedText"" text NOT NULL DEFAULT '',
            ""Reason"" text NOT NULL DEFAULT '',
            CONSTRAINT ""PK_AnalysisSuggestions"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_AnalysisSuggestions_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE CASCADE
        )",
    ["CourseRecommendations"] = @"
        CREATE TABLE IF NOT EXISTS ""CourseRecommendations"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""AnalysisId"" uuid NOT NULL,
            ""SkillName"" character varying(256) NOT NULL DEFAULT '',
            ""Priority"" character varying(32) NOT NULL DEFAULT 'Medium',
            ""Difficulty"" character varying(32) NOT NULL DEFAULT 'Beginner',
            ""EstimatedHours"" integer NOT NULL DEFAULT 10,
            ""FreeResourceTitle"" character varying(512) NOT NULL DEFAULT '',
            ""FreeResourceUrl"" character varying(2048) NOT NULL DEFAULT '',
            ""PaidResourceTitle"" character varying(512) NOT NULL DEFAULT '',
            ""PaidResourceUrl"" character varying(2048) NOT NULL DEFAULT '',
            ""PracticeProject"" text NOT NULL DEFAULT '',
            CONSTRAINT ""PK_CourseRecommendations"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_CourseRecommendations_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE CASCADE
        )",
    ["UserCourseSelections"] = @"
        CREATE TABLE IF NOT EXISTS ""UserCourseSelections"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""CourseRecommendationId"" uuid NOT NULL,
            ""SelectedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT ""PK_UserCourseSelections"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_UserCourseSelections_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE,
            CONSTRAINT ""FK_UserCourseSelections_CourseRecommendations_CourseRecommendationId"" FOREIGN KEY (""CourseRecommendationId"")
                REFERENCES ""CourseRecommendations"" (""Id"") ON DELETE CASCADE
        )",
    ["UserCourseProgress"] = @"
        CREATE TABLE IF NOT EXISTS ""UserCourseProgress"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""CourseRecommendationId"" uuid NOT NULL,
            ""PercentComplete"" integer NOT NULL DEFAULT 0,
            ""LastUpdatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT ""PK_UserCourseProgress"" PRIMARY KEY (""Id""),
            CONSTRAINT ""CK_UserCourseProgress_PercentComplete"" CHECK (""PercentComplete"" >= 0 AND ""PercentComplete"" <= 100),
            CONSTRAINT ""FK_UserCourseProgress_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE,
            CONSTRAINT ""FK_UserCourseProgress_CourseRecommendations_CourseRecommendationId"" FOREIGN KEY (""CourseRecommendationId"")
                REFERENCES ""CourseRecommendations"" (""Id"") ON DELETE CASCADE
        )",
    ["GeneratedResumes"] = @"
        CREATE TABLE IF NOT EXISTS ""GeneratedResumes"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""AnalysisId"" uuid NOT NULL,
            ""RoleTitle"" character varying(256) NOT NULL DEFAULT '',
            ""ContentJson"" jsonb NOT NULL DEFAULT '{}',
            ""PlainText"" text NOT NULL DEFAULT '',
            ""GeneratedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            ""Version"" integer NOT NULL DEFAULT 1,
            CONSTRAINT ""PK_GeneratedResumes"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_GeneratedResumes_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE,
            CONSTRAINT ""FK_GeneratedResumes_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE RESTRICT
        )",
    ["AnalysisHistories"] = @"
        CREATE TABLE IF NOT EXISTS ""AnalysisHistories"" (
            ""Id"" uuid NOT NULL DEFAULT gen_random_uuid(),
            ""UserId"" uuid NOT NULL,
            ""AnalysisId"" uuid NOT NULL,
            ""EventType"" character varying(64) NOT NULL DEFAULT '',
            ""EventDetail"" text NOT NULL DEFAULT '',
            ""OccurredAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT ""PK_AnalysisHistories"" PRIMARY KEY (""Id""),
            CONSTRAINT ""FK_AnalysisHistories_Users_UserId"" FOREIGN KEY (""UserId"")
                REFERENCES ""Users"" (""Id"") ON DELETE CASCADE,
            CONSTRAINT ""FK_AnalysisHistories_Analyses_AnalysisId"" FOREIGN KEY (""AnalysisId"")
                REFERENCES ""Analyses"" (""Id"") ON DELETE CASCADE
        )"
};

foreach (var (tableName, sql) in createStatements)
{
    if (!existingTables.Contains(tableName))
    {
        Console.WriteLine($"Creating table: {tableName}");
        await using var cmd = new NpgsqlCommand(sql, conn);
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine($"  -> Created.");
    }
    else
    {
        Console.WriteLine($"Table already exists: {tableName}");
    }
}

Console.WriteLine("\nDone! All tables are in place.");
