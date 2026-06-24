using Microsoft.EntityFrameworkCore;
using System;
using TechAsset.Domain.Entities;

namespace TechAsset.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Equipo> Equipos => Set<Equipo>();
        public DbSet<Prestamo> Prestamos => Set<Prestamo>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la entidad Usuario
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnName("id");

                entity.Property(e => e.Nombres)
                    .HasColumnName("nombres")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Apellidos)
                    .HasColumnName("apellidos")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Correo)
                    .HasColumnName("correo")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.HasIndex(e => e.Correo).IsUnique();

                entity.Property(e => e.Area)
                    .HasColumnName("area")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Estado)
                    .HasColumnName("estado")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(e => e.PasswordHash)
                    .HasColumnName("password_hash")
                    .IsRequired();

                entity.Property(e => e.Rol)
                    .HasColumnName("rol")
                    .HasMaxLength(30)
                    .HasDefaultValue("Colaborador")
                    .IsRequired();

                // Seeding Data (Usuarios Iniciales)
                var hash = "$2a$11$S1xyiqsGkI5mSs97xOhroeNOjG4MhnXPPM5LhO9xKeYfQQTf9rk/C"; // '123456'
                entity.HasData(
                    new Usuario
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Nombres = "Juan",
                        Apellidos = "Admin",
                        Correo = "admin@techasset.com",
                        Area = "Tecnología",
                        PasswordHash = hash,
                        Rol = "Admin",
                        Estado = true
                    },
                    new Usuario
                    {
                        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Nombres = "Carlos",
                        Apellidos = "Tecnico",
                        Correo = "tecnico@techasset.com",
                        Area = "Tecnología",
                        PasswordHash = hash,
                        Rol = "Tecnico",
                        Estado = true
                    },
                    new Usuario
                    {
                        Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        Nombres = "Maria",
                        Apellidos = "Colaborador",
                        Correo = "colaborador@techasset.com",
                        Area = "Recursos Humanos",
                        PasswordHash = hash,
                        Rol = "Colaborador",
                        Estado = true
                    }
                );
            });

            // Configuración de la entidad Equipo
            modelBuilder.Entity<Equipo>(entity =>
            {
                entity.ToTable("equipos");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnName("id");

                entity.Property(e => e.CodigoPatrimonial)
                    .HasColumnName("codigo_patrimonial")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.HasIndex(e => e.CodigoPatrimonial).IsUnique();

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Categoria)
                    .HasColumnName("categoria")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Marca)
                    .HasColumnName("marca")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Estado)
                    .HasColumnName("estado")
                    .HasMaxLength(30)
                    .HasDefaultValue("Disponible")
                    .IsRequired();

                // Seeding Data (Equipos Iniciales)
                entity.HasData(
                    new Equipo
                    {
                        Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        CodigoPatrimonial = "LAP-001",
                        Nombre = "Laptop Lenovo ThinkPad L14",
                        Categoria = "Laptops",
                        Marca = "Lenovo",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                        CodigoPatrimonial = "LAP-002",
                        Nombre = "Laptop Dell Latitude 5420",
                        Categoria = "Laptops",
                        Marca = "Dell",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                        CodigoPatrimonial = "PC-001",
                        Nombre = "Computadora HP ProDesk 600 G6",
                        Categoria = "Computadoras de escritorio",
                        Marca = "HP",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                        CodigoPatrimonial = "MON-001",
                        Nombre = "Monitor LG UltraGear 24 pulgadas",
                        Categoria = "Monitores",
                        Marca = "LG",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                        CodigoPatrimonial = "IMP-001",
                        Nombre = "Impresora HP LaserJet Pro M404dn",
                        Categoria = "Impresoras",
                        Marca = "HP",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        CodigoPatrimonial = "TAB-001",
                        Nombre = "Tablet Samsung Galaxy Tab S7",
                        Categoria = "Tablets",
                        Marca = "Samsung",
                        Estado = "Disponible"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        CodigoPatrimonial = "PRO-001",
                        Nombre = "Proyector Epson PowerLite X49",
                        Categoria = "Proyectores multimedia",
                        Marca = "Epson",
                        Estado = "Mantenimiento"
                    },
                    new Equipo
                    {
                        Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                        CodigoPatrimonial = "NET-001",
                        Nombre = "Switch Cisco Catalyst 2960",
                        Categoria = "Equipos de red",
                        Marca = "Cisco",
                        Estado = "Disponible"
                    }
                );
            });

            // Configuración de la entidad Prestamo
            modelBuilder.Entity<Prestamo>(entity =>
            {
                entity.ToTable("prestamos");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnName("id");

                entity.Property(e => e.FechaPrestamo)
                    .HasColumnName("fecha_prestamo")
                    .HasColumnType("date")
                    .IsRequired();

                entity.Property(e => e.FechaDevolucion)
                    .HasColumnName("fecha_devolucion")
                    .HasColumnType("date");

                entity.Property(e => e.Observacion)
                    .HasColumnName("observacion")
                    .HasColumnType("text");

                entity.Property(e => e.UsuarioId)
                    .HasColumnName("usuario_id")
                    .IsRequired();

                entity.Property(e => e.EquipoId)
                    .HasColumnName("equipo_id")
                    .IsRequired();

                // Relaciones
                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Prestamos)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Equipo)
                    .WithMany(p => p.Prestamos)
                    .HasForeignKey(d => d.EquipoId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
