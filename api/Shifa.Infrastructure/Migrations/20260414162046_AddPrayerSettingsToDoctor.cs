using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shifa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPrayerSettingsToDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "BlockPrayerTimes",
                table: "Doctors",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DefaultMinutesAfter",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefaultMinutesBefore",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "JumuahMinutesAfter",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "JumuahMinutesBefore",
                table: "Doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlockPrayerTimes",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "DefaultMinutesAfter",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "DefaultMinutesBefore",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "JumuahMinutesAfter",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "JumuahMinutesBefore",
                table: "Doctors");
        }
    }
}
