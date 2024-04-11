using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Datasets",
                columns: table => new
                {
                    UID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImageNames = table.Column<string[]>(type: "text[]", nullable: false),
                    TimeCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AuthorUID = table.Column<string>(type: "text", nullable: false),
                    IsAuthorGuest = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Datasets", x => x.UID);
                });

            migrationBuilder.CreateTable(
                name: "GuestUsers",
                columns: table => new
                {
                    UID = table.Column<string>(type: "text", nullable: false),
                    OwnedDatasets = table.Column<int[]>(type: "integer[]", nullable: false),
                    LastDateModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestUsers", x => x.UID);
                });

            migrationBuilder.CreateTable(
                name: "PermanentUsers",
                columns: table => new
                {
                    UID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermanentUsers", x => x.UID);
                });

            migrationBuilder.CreateTable(
                name: "RankingChoices",
                columns: table => new
                {
                    UID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    datasetKey = table.Column<int>(type: "integer", nullable: false),
                    user = table.Column<string>(type: "text", nullable: false),
                    promptLeftIndex = table.Column<int>(type: "integer", nullable: false),
                    promptRightIndex = table.Column<int>(type: "integer", nullable: false),
                    choice = table.Column<int>(type: "integer", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RankingChoices", x => x.UID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Datasets");

            migrationBuilder.DropTable(
                name: "GuestUsers");

            migrationBuilder.DropTable(
                name: "PermanentUsers");

            migrationBuilder.DropTable(
                name: "RankingChoices");
        }
    }
}
