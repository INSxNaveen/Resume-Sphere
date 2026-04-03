using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDeductionReasonsAndCourseDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCourseProgresses_CourseRecommendations_CourseRecommenda~",
                table: "UserCourseProgresses");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCourseProgresses_Users_UserId",
                table: "UserCourseProgresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserCourseProgresses",
                table: "UserCourseProgresses");

            migrationBuilder.DropColumn(
                name: "OriginalText",
                table: "AnalysisSuggestions");

            migrationBuilder.DropColumn(
                name: "Reason",
                table: "AnalysisSuggestions");

            migrationBuilder.RenameTable(
                name: "UserCourseProgresses",
                newName: "UserCourseProgress");

            migrationBuilder.RenameColumn(
                name: "SuggestedText",
                table: "AnalysisSuggestions",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "WhereItMatters",
                table: "AnalysisMissingKeywords",
                newName: "Context");

            migrationBuilder.RenameIndex(
                name: "IX_UserCourseProgresses_UserId",
                table: "UserCourseProgress",
                newName: "IX_UserCourseProgress_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserCourseProgresses_CourseRecommendationId",
                table: "UserCourseProgress",
                newName: "IX_UserCourseProgress_CourseRecommendationId");

            migrationBuilder.AddColumn<string>(
                name: "WhyItMatters",
                table: "CourseRecommendations",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AnalysisSuggestions",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DeductionReasonsJson",
                table: "Analyses",
                type: "jsonb",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedAt",
                table: "UserCourseProgress",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserCourseProgress",
                table: "UserCourseProgress",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCourseProgress_CourseRecommendations_CourseRecommendati~",
                table: "UserCourseProgress",
                column: "CourseRecommendationId",
                principalTable: "CourseRecommendations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCourseProgress_Users_UserId",
                table: "UserCourseProgress",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCourseProgress_CourseRecommendations_CourseRecommendati~",
                table: "UserCourseProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCourseProgress_Users_UserId",
                table: "UserCourseProgress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserCourseProgress",
                table: "UserCourseProgress");

            migrationBuilder.DropColumn(
                name: "WhyItMatters",
                table: "CourseRecommendations");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "AnalysisSuggestions");

            migrationBuilder.DropColumn(
                name: "DeductionReasonsJson",
                table: "Analyses");

            migrationBuilder.DropColumn(
                name: "LastUpdatedAt",
                table: "UserCourseProgress");

            migrationBuilder.RenameTable(
                name: "UserCourseProgress",
                newName: "UserCourseProgresses");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "AnalysisSuggestions",
                newName: "SuggestedText");

            migrationBuilder.RenameColumn(
                name: "Context",
                table: "AnalysisMissingKeywords",
                newName: "WhereItMatters");

            migrationBuilder.RenameIndex(
                name: "IX_UserCourseProgress_UserId",
                table: "UserCourseProgresses",
                newName: "IX_UserCourseProgresses_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserCourseProgress_CourseRecommendationId",
                table: "UserCourseProgresses",
                newName: "IX_UserCourseProgresses_CourseRecommendationId");

            migrationBuilder.AddColumn<string>(
                name: "OriginalText",
                table: "AnalysisSuggestions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "AnalysisSuggestions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserCourseProgresses",
                table: "UserCourseProgresses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCourseProgresses_CourseRecommendations_CourseRecommenda~",
                table: "UserCourseProgresses",
                column: "CourseRecommendationId",
                principalTable: "CourseRecommendations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCourseProgresses_Users_UserId",
                table: "UserCourseProgresses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
