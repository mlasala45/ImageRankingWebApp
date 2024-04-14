using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class AddAreImagesStoredInDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AreImagesStoredInDatabase",
                table: "Datasets",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AreImagesStoredInDatabase",
                table: "Datasets");
        }
    }
}
