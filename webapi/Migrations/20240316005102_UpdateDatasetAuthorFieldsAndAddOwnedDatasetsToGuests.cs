using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatasetAuthorFieldsAndAddOwnedDatasetsToGuests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuthorConnectionID",
                table: "Datasets",
                newName: "AuthorUID");

            migrationBuilder.AddColumn<string>(
                name: "OwnedDatasets",
                table: "GuestUsers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsAuthorGuest",
                table: "Datasets",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnedDatasets",
                table: "GuestUsers");

            migrationBuilder.DropColumn(
                name: "IsAuthorGuest",
                table: "Datasets");

            migrationBuilder.RenameColumn(
                name: "AuthorUID",
                table: "Datasets",
                newName: "AuthorConnectionID");
        }
    }
}
