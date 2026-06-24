using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TechAsset.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedEquipos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "equipos",
                columns: new[] { "id", "categoria", "codigo_patrimonial", "estado", "marca", "nombre" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Laptops", "LAP-001", "Disponible", "Lenovo", "Laptop Lenovo ThinkPad L14" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "Laptops", "LAP-002", "Disponible", "Dell", "Laptop Dell Latitude 5420" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "Computadoras de escritorio", "PC-001", "Disponible", "HP", "Computadora HP ProDesk 600 G6" },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "Monitores", "MON-001", "Disponible", "LG", "Monitor LG UltraGear 24 pulgadas" },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "Impresoras", "IMP-001", "Disponible", "HP", "Impresora HP LaserJet Pro M404dn" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Tablets", "TAB-001", "Disponible", "Samsung", "Tablet Samsung Galaxy Tab S7" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Proyectores multimedia", "PRO-001", "Mantenimiento", "Epson", "Proyector Epson PowerLite X49" },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Equipos de red", "NET-001", "Disponible", "Cisco", "Switch Cisco Catalyst 2960" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));

            migrationBuilder.DeleteData(
                table: "equipos",
                keyColumn: "id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));
        }
    }
}
