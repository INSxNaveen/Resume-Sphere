using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialResumeOnlySchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlockedDevices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    CreatesAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlockedDevices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlockedIps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlockedIps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    OtpHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    OtpExpiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsEmailVerified = table.Column<bool>(type: "boolean", nullable: false),
                    AbuseRiskScore = table.Column<int>(type: "integer", nullable: false),
                    IsSuspended = table.Column<bool>(type: "boolean", nullable: false),
                    SuspendedUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Resumes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    FileType = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    RawText = table.Column<string>(type: "text", nullable: false),
                    NormalizedText = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resumes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resumes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UploadModerationEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    FileName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Decision = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    RiskScoreImpact = table.Column<int>(type: "integer", nullable: false),
                    DeviceHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadModerationEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UploadModerationEvents_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Analyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CurrentSkillsJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "[]"),
                    EligibleJobsJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "[]"),
                    ImprovementSuggestionsJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "[]"),
                    UnlockedOpportunitiesJson = table.Column<string>(type: "jsonb", nullable: false, defaultValue: "[]"),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analyses", x => x.Id);
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
                name: "AnalysisSuggestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Title = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
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
                    WhyItMatters = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
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
                name: "UserCourseProgress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseRecommendationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    PercentComplete = table.Column<int>(type: "integer", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCourseProgress", x => x.Id);
                    table.CheckConstraint("CK_UserCourseProgress_PercentComplete", "\"PercentComplete\" >= 0 AND \"PercentComplete\" <= 100");
                    table.ForeignKey(
                        name: "FK_UserCourseProgress_CourseRecommendations_CourseRecommendati~",
                        column: x => x.CourseRecommendationId,
                        principalTable: "CourseRecommendations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCourseProgress_Users_UserId",
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
                name: "IX_AnalysisSuggestions_AnalysisId",
                table: "AnalysisSuggestions",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_BlockedDevices_DeviceHash",
                table: "BlockedDevices",
                column: "DeviceHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlockedIps_IpAddress",
                table: "BlockedIps",
                column: "IpAddress",
                unique: true);

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
                name: "IX_ResumeExtractedSkills_AnalysisId",
                table: "ResumeExtractedSkills",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeExtractedSkills_ResumeId",
                table: "ResumeExtractedSkills",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_UserId",
                table: "Resumes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UploadModerationEvents_UserId",
                table: "UploadModerationEvents",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseProgress_CourseRecommendationId",
                table: "UserCourseProgress",
                column: "CourseRecommendationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseProgress_UserId",
                table: "UserCourseProgress",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseSelections_CourseRecommendationId",
                table: "UserCourseSelections",
                column: "CourseRecommendationId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseSelections_UserId",
                table: "UserCourseSelections",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalysisHistories");

            migrationBuilder.DropTable(
                name: "AnalysisSuggestions");

            migrationBuilder.DropTable(
                name: "BlockedDevices");

            migrationBuilder.DropTable(
                name: "BlockedIps");

            migrationBuilder.DropTable(
                name: "GeneratedResumes");

            migrationBuilder.DropTable(
                name: "ResumeExtractedSkills");

            migrationBuilder.DropTable(
                name: "UploadModerationEvents");

            migrationBuilder.DropTable(
                name: "UserCourseProgress");

            migrationBuilder.DropTable(
                name: "UserCourseSelections");

            migrationBuilder.DropTable(
                name: "CourseRecommendations");

            migrationBuilder.DropTable(
                name: "Analyses");

            migrationBuilder.DropTable(
                name: "Resumes");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
