using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ResumeAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFullResumeSphereSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 7 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 20 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 23 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 4 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 5 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 10 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 13 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 23 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 1 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 16 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 17 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 28 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 29 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 30 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 20 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 21 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 25 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 27 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 3 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 7 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 14 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 15 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 23 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 4 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 5 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 10 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 7 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 8 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 9 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 1 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 16 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 18 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 19 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 20 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 20 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 21 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 25 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 26 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 27 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 2 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 6 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 20 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 22 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 23 });

            migrationBuilder.DeleteData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 24 });

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Jobs",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "Id",
                keyValue: 30);

            // PostgreSQL cannot ALTER a column from integer to uuid in-place.
            // Drop and recreate both tables with UUID PKs. All statements are idempotent.
            migrationBuilder.Sql(@"ALTER TABLE IF EXISTS ""Resumes"" DROP CONSTRAINT IF EXISTS ""FK_Resumes_Users_UserId""");
            migrationBuilder.Sql(@"DROP TABLE IF EXISTS ""Resumes""");
            migrationBuilder.Sql(@"DROP TABLE IF EXISTS ""Users""");

            // Recreate Users with Guid PK
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS ""Users"" (
                    ""Id""           uuid NOT NULL DEFAULT gen_random_uuid(),
                    ""Email""        character varying(256) NOT NULL,
                    ""PasswordHash"" text NOT NULL,
                    ""FullName""     character varying(256) NOT NULL DEFAULT '',
                    ""CreatedAt""    timestamp with time zone NOT NULL DEFAULT NOW(),
                    CONSTRAINT ""PK_Users"" PRIMARY KEY (""Id"")
                )");


            // Recreate Resumes with Guid PK and FK
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS ""Resumes"" (
                    ""Id""             uuid NOT NULL DEFAULT gen_random_uuid(),
                    ""UserId""         uuid NOT NULL,
                    ""FileName""       character varying(512) NOT NULL DEFAULT '',
                    ""FileType""       character varying(10)  NOT NULL DEFAULT '',
                    ""RawText""        text NOT NULL DEFAULT '',
                    ""NormalizedText"" text NOT NULL DEFAULT '',
                    ""UploadedAt""     timestamp with time zone NOT NULL DEFAULT NOW(),
                    CONSTRAINT ""PK_Resumes"" PRIMARY KEY (""Id""),
                    CONSTRAINT ""FK_Resumes_Users_UserId"" FOREIGN KEY (""UserId"")
                        REFERENCES ""Users"" (""Id"") ON DELETE CASCADE
                )");
            migrationBuilder.Sql(@"CREATE INDEX IF NOT EXISTS ""IX_Resumes_UserId"" ON ""Resumes"" (""UserId"")");




            migrationBuilder.CreateTable(
                name: "JobDescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RawText = table.Column<string>(type: "text", nullable: false),
                    NormalizedText = table.Column<string>(type: "text", nullable: false),
                    RoleTitle = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ExperienceLevel = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobDescriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Analyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobDescriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    OverallScore = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    ScoreBreakdownJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "{}"),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Analyses_JobDescriptions_JobDescriptionId",
                        column: x => x.JobDescriptionId,
                        principalTable: "JobDescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Analyses_Resumes_ResumeId",
                        column: x => x.ResumeId,
                        principalTable: "Resumes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Analyses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalysisHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    EventType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    EventDetail = table.Column<string>(type: "text", nullable: false),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisHistories_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnalysisHistories_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalysisMissingKeywords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    Keyword = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    WhereItMatters = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisMissingKeywords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisMissingKeywords_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalysisMissingSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Priority = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    WhyItMatters = table.Column<string>(type: "text", nullable: false),
                    Decision = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisMissingSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisMissingSkills_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalysisSuggestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    OriginalText = table.Column<string>(type: "text", nullable: false),
                    SuggestedText = table.Column<string>(type: "text", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisSuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisSuggestions_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseRecommendations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Priority = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Difficulty = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    EstimatedHours = table.Column<int>(type: "integer", nullable: false),
                    FreeResourceTitle = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    FreeResourceUrl = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    PaidResourceTitle = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    PaidResourceUrl = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    PracticeProject = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseRecommendations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseRecommendations_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GeneratedResumes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleTitle = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ContentJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "{}"),
                    PlainText = table.Column<string>(type: "text", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneratedResumes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GeneratedResumes_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GeneratedResumes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobDescriptionExtractedSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JobDescriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Priority = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    KeywordFrequency = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDescriptionExtractedSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobDescriptionExtractedSkills_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobDescriptionExtractedSkills_JobDescriptions_JobDescriptio~",
                        column: x => x.JobDescriptionId,
                        principalTable: "JobDescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResumeExtractedSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Section = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Confidence = table.Column<decimal>(type: "numeric(4,3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResumeExtractedSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResumeExtractedSkills_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResumeExtractedSkills_Resumes_ResumeId",
                        column: x => x.ResumeId,
                        principalTable: "Resumes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserCourseProgresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseRecommendationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    PercentComplete = table.Column<int>(type: "integer", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCourseProgresses", x => x.Id);
                    table.CheckConstraint("CK_UserCourseProgress_PercentComplete", "\"PercentComplete\" >= 0 AND \"PercentComplete\" <= 100");
                    table.ForeignKey(
                        name: "FK_UserCourseProgresses_CourseRecommendations_CourseRecommenda~",
                        column: x => x.CourseRecommendationId,
                        principalTable: "CourseRecommendations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCourseProgresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserCourseSelections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseRecommendationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCourseSelections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCourseSelections_CourseRecommendations_CourseRecommenda~",
                        column: x => x.CourseRecommendationId,
                        principalTable: "CourseRecommendations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCourseSelections_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_JobDescriptionId",
                table: "Analyses",
                column: "JobDescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_ResumeId",
                table: "Analyses",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_UserId",
                table: "Analyses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisHistories_AnalysisId",
                table: "AnalysisHistories",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisHistories_UserId",
                table: "AnalysisHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisMissingKeywords_AnalysisId",
                table: "AnalysisMissingKeywords",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisMissingSkills_AnalysisId",
                table: "AnalysisMissingSkills",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisSuggestions_AnalysisId",
                table: "AnalysisSuggestions",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseRecommendations_AnalysisId",
                table: "CourseRecommendations",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedResumes_AnalysisId",
                table: "GeneratedResumes",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedResumes_UserId",
                table: "GeneratedResumes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptionExtractedSkills_AnalysisId",
                table: "JobDescriptionExtractedSkills",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptionExtractedSkills_JobDescriptionId",
                table: "JobDescriptionExtractedSkills",
                column: "JobDescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptions_UserId",
                table: "JobDescriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeExtractedSkills_AnalysisId",
                table: "ResumeExtractedSkills",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeExtractedSkills_ResumeId",
                table: "ResumeExtractedSkills",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseProgresses_CourseRecommendationId",
                table: "UserCourseProgresses",
                column: "CourseRecommendationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseProgresses_UserId",
                table: "UserCourseProgresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseSelections_CourseRecommendationId",
                table: "UserCourseSelections",
                column: "CourseRecommendationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseSelections_UserId",
                table: "UserCourseSelections",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalysisHistories");

            migrationBuilder.DropTable(
                name: "AnalysisMissingKeywords");

            migrationBuilder.DropTable(
                name: "AnalysisMissingSkills");

            migrationBuilder.DropTable(
                name: "AnalysisSuggestions");

            migrationBuilder.DropTable(
                name: "GeneratedResumes");

            migrationBuilder.DropTable(
                name: "JobDescriptionExtractedSkills");

            migrationBuilder.DropTable(
                name: "ResumeExtractedSkills");

            migrationBuilder.DropTable(
                name: "UserCourseProgresses");

            migrationBuilder.DropTable(
                name: "UserCourseSelections");

            migrationBuilder.DropTable(
                name: "CourseRecommendations");

            migrationBuilder.DropTable(
                name: "Analyses");

            migrationBuilder.DropTable(
                name: "JobDescriptions");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "NormalizedText",
                table: "Resumes");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Resumes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UploadedAt",
                table: "Resumes",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "Resumes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(512)",
                oldMaxLength: 512);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Resumes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.InsertData(
                table: "Jobs",
                columns: new[] { "Id", "Company", "Description", "Title" },
                values: new object[,]
                {
                    { 1, "TechCorp", "Build scalable Python APIs.", "Python Backend Developer" },
                    { 2, "WebSolutions", "Frontend + backend web development.", "Full Stack Developer" },
                    { 3, "DataLabs", "ML model building and data analysis.", "Data Scientist" },
                    { 4, "CloudOps", "CI/CD, infrastructure, and cloud.", "DevOps Engineer" },
                    { 5, "EnterpriseSoft", "Enterprise application development with .NET.", ".NET Developer" },
                    { 6, "UIStudio", "Build modern React UIs.", "Frontend React Developer" },
                    { 7, "DBMasters", "Manage and optimize databases.", "Database Administrator" },
                    { 8, "AI Dynamics", "Deploy and tune ML models.", "Machine Learning Engineer" },
                    { 9, "SkyArch", "Design cloud-native architectures.", "Cloud Solutions Architect" },
                    { 10, "MicroTech", "Build Java-based microservices.", "Java Microservices Developer" }
                });

            migrationBuilder.InsertData(
                table: "Skills",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Python" },
                    { 2, "Java" },
                    { 3, "C#" },
                    { 4, "JavaScript" },
                    { 5, "TypeScript" },
                    { 6, "SQL" },
                    { 7, "PostgreSQL" },
                    { 8, "MySQL" },
                    { 9, "MongoDB" },
                    { 10, "React" },
                    { 11, "Angular" },
                    { 12, "Vue" },
                    { 13, "Node.js" },
                    { 14, ".NET" },
                    { 15, "ASP.NET Core" },
                    { 16, "Machine Learning" },
                    { 17, "Deep Learning" },
                    { 18, "TensorFlow" },
                    { 19, "PyTorch" },
                    { 20, "Docker" },
                    { 21, "Kubernetes" },
                    { 22, "Git" },
                    { 23, "REST API" },
                    { 24, "GraphQL" },
                    { 25, "AWS" },
                    { 26, "Azure" },
                    { 27, "Linux" },
                    { 28, "Data Analysis" },
                    { 29, "Pandas" },
                    { 30, "Scikit-learn" }
                });

            migrationBuilder.InsertData(
                table: "JobSkills",
                columns: new[] { "JobId", "SkillId", "IsCore" },
                values: new object[,]
                {
                    { 1, 1, true },
                    { 1, 6, true },
                    { 1, 7, true },
                    { 1, 20, false },
                    { 1, 22, false },
                    { 1, 23, false },
                    { 2, 4, true },
                    { 2, 5, true },
                    { 2, 6, true },
                    { 2, 10, true },
                    { 2, 13, true },
                    { 2, 22, false },
                    { 2, 23, false },
                    { 3, 1, true },
                    { 3, 6, false },
                    { 3, 16, true },
                    { 3, 17, true },
                    { 3, 28, true },
                    { 3, 29, true },
                    { 3, 30, true },
                    { 4, 20, true },
                    { 4, 21, true },
                    { 4, 22, false },
                    { 4, 25, true },
                    { 4, 27, true },
                    { 5, 3, true },
                    { 5, 6, true },
                    { 5, 7, true },
                    { 5, 14, true },
                    { 5, 15, true },
                    { 5, 22, false },
                    { 5, 23, false },
                    { 6, 4, true },
                    { 6, 5, true },
                    { 6, 10, true },
                    { 6, 22, false },
                    { 7, 6, true },
                    { 7, 7, true },
                    { 7, 8, true },
                    { 7, 9, true },
                    { 8, 1, true },
                    { 8, 16, true },
                    { 8, 18, true },
                    { 8, 19, true },
                    { 8, 20, false },
                    { 8, 22, false },
                    { 9, 20, false },
                    { 9, 21, true },
                    { 9, 25, true },
                    { 9, 26, true },
                    { 9, 27, false },
                    { 10, 2, true },
                    { 10, 6, true },
                    { 10, 20, false },
                    { 10, 22, false },
                    { 10, 23, true },
                    { 10, 24, false }
                });
        }
    }
}
