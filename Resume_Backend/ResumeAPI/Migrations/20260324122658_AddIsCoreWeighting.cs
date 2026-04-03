using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddIsCoreWeighting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCore",
                table: "JobSkills",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 1 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 6 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 7 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 20 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 1, 23 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 4 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 5 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 6 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 10 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 13 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 2, 23 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 1 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 6 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 16 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 17 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 28 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 29 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 3, 30 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 20 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 21 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 25 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 4, 27 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 3 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 6 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 7 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 14 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 15 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 5, 23 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 4 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 5 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 10 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 6, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 6 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 7 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 8 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 7, 9 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 1 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 16 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 18 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 19 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 20 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 8, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 20 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 21 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 25 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 26 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 9, 27 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 2 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 6 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 20 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 22 },
                column: "IsCore",
                value: false);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 23 },
                column: "IsCore",
                value: true);

            migrationBuilder.UpdateData(
                table: "JobSkills",
                keyColumns: new[] { "JobId", "SkillId" },
                keyValues: new object[] { 10, 24 },
                column: "IsCore",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCore",
                table: "JobSkills");
        }
    }
}
