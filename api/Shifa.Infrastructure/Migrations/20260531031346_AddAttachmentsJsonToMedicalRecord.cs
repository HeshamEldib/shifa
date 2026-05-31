using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shifa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentsJsonToMedicalRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentsJson",
                table: "MedicalRecords",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentsJson",
                table: "MedicalRecords");
        }
    }
}
