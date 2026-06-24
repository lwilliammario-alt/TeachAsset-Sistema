using System;

namespace TechAsset.Application.DTOs
{
    public class CreatePrestamoDto
    {
        public Guid UsuarioId { get; set; }
        public Guid EquipoId { get; set; }
        public DateTime FechaPrestamo { get; set; }
        public string? Observacion { get; set; }
    }
}
