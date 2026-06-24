using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TechAsset.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthAndEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                table: "usuarios",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "rol",
                table: "usuarios",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "Colaborador");

            migrationBuilder.InsertData(
                table: "usuarios",
                columns: new[] { "id", "apellidos", "area", "correo", "estado", "nombres", "password_hash", "rol" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Admin", "Tecnología", "admin@techasset.com", true, "Juan", "$2a$11$S1xyiqsGkI5mSs97xOhroeNOjG4MhnXPPM5LhO9xKeYfQQTf9rk/C", "Admin" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Tecnico", "Tecnología", "tecnico@techasset.com", true, "Carlos", "$2a$11$S1xyiqsGkI5mSs97xOhroeNOjG4MhnXPPM5LhO9xKeYfQQTf9rk/C", "Tecnico" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Colaborador", "Recursos Humanos", "colaborador@techasset.com", true, "Maria", "$2a$11$S1xyiqsGkI5mSs97xOhroeNOjG4MhnXPPM5LhO9xKeYfQQTf9rk/C", "Colaborador" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "usuarios",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "usuarios",
                keyColumn: "id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "usuarios",
                keyColumn: "id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DropColumn(
                name: "password_hash",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "rol",
                table: "usuarios");
        }
    }
}
