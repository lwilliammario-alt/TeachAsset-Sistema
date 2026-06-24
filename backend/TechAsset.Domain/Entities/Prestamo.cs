using System;

namespace TechAsset.Domain.Entities
{
    public class Prestamo
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime FechaPrestamo { get; set; }
        public DateTime? FechaDevolucion { get; set; }
        public string? Observacion { get; set; }

        // Relaciones
        public Guid UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public Guid EquipoId { get; set; }
        public Equipo? Equipo { get; set; }
    }
}
