using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class ExpandPermanentUserAndAddDateLastSignedIn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastDateModified",
                table: "GuestUsers",
                newName: "DateLastSignedIn");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateLastSignedIn",
                table: "PermanentUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "PermanentUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GoogleSubjectNumber",
                table: "PermanentUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int[]>(
                name: "OwnedDatasets",
                table: "PermanentUsers",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "GuestUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateLastSignedIn",
                table: "PermanentUsers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "PermanentUsers");

            migrationBuilder.DropColumn(
                name: "GoogleSubjectNumber",
                table: "PermanentUsers");

            migrationBuilder.DropColumn(
                name: "OwnedDatasets",
                table: "PermanentUsers");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "GuestUsers");

            migrationBuilder.RenameColumn(
                name: "DateLastSignedIn",
                table: "GuestUsers",
                newName: "LastDateModified");
        }
    }
}
