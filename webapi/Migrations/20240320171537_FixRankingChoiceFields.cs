using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class FixRankingChoiceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "choice",
                table: "RankingChoices",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "datasetKey",
                table: "RankingChoices",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "promptLeftIndex",
                table: "RankingChoices",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "promptRightIndex",
                table: "RankingChoices",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "user",
                table: "RankingChoices",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "choice",
                table: "RankingChoices");

            migrationBuilder.DropColumn(
                name: "datasetKey",
                table: "RankingChoices");

            migrationBuilder.DropColumn(
                name: "promptLeftIndex",
                table: "RankingChoices");

            migrationBuilder.DropColumn(
                name: "promptRightIndex",
                table: "RankingChoices");

            migrationBuilder.DropColumn(
                name: "user",
                table: "RankingChoices");
        }
    }
}
