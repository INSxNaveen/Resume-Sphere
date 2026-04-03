using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ResumeAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Company = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobSkills",
                columns: table => new
                {
                    JobId = table.Column<int>(type: "integer", nullable: false),
                    SkillId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobSkills", x => new { x.JobId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_JobSkills_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Resumes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    RawText = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                columns: new[] { "JobId", "SkillId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 6 },
                    { 1, 7 },
                    { 1, 20 },
                    { 1, 22 },
                    { 1, 23 },
                    { 2, 4 },
                    { 2, 5 },
                    { 2, 6 },
                    { 2, 10 },
                    { 2, 13 },
                    { 2, 22 },
                    { 2, 23 },
                    { 3, 1 },
                    { 3, 6 },
                    { 3, 16 },
                    { 3, 17 },
                    { 3, 28 },
                    { 3, 29 },
                    { 3, 30 },
                    { 4, 20 },
                    { 4, 21 },
                    { 4, 22 },
                    { 4, 25 },
                    { 4, 27 },
                    { 5, 3 },
                    { 5, 6 },
                    { 5, 7 },
                    { 5, 14 },
                    { 5, 15 },
                    { 5, 22 },
                    { 5, 23 },
                    { 6, 4 },
                    { 6, 5 },
                    { 6, 10 },
                    { 6, 22 },
                    { 7, 6 },
                    { 7, 7 },
                    { 7, 8 },
                    { 7, 9 },
                    { 8, 1 },
                    { 8, 16 },
                    { 8, 18 },
                    { 8, 19 },
                    { 8, 20 },
                    { 8, 22 },
                    { 9, 20 },
                    { 9, 21 },
                    { 9, 25 },
                    { 9, 26 },
                    { 9, 27 },
                    { 10, 2 },
                    { 10, 6 },
                    { 10, 20 },
                    { 10, 22 },
                    { 10, 23 },
                    { 10, 24 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobSkills_SkillId",
                table: "JobSkills",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_UserId",
                table: "Resumes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Skills_Name",
                table: "Skills",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobSkills");

            migrationBuilder.DropTable(
                name: "Resumes");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "Skills");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
