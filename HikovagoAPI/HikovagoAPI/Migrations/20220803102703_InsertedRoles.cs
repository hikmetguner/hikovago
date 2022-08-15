using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HikovagoAPI.Migrations
{
    public partial class InsertedRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "30213bf3-ad66-46c9-a12d-994516b39bb4", "4f2e7e6c-5ff0-4545-aeaf-548ceec0a1f0", "Producer", "PRODUCER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "6092618e-f207-49fa-a068-3aaad3bd4ef1", "9fb0cc48-43a6-4860-9955-97212a5dc177", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "fabce110-1f46-4d03-bff0-f2837b0126d8", "1af99659-efc2-4f8f-8980-932afe6d8a4f", "Consumer", "CONSUMER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30213bf3-ad66-46c9-a12d-994516b39bb4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6092618e-f207-49fa-a068-3aaad3bd4ef1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fabce110-1f46-4d03-bff0-f2837b0126d8");
        }
    }
}
