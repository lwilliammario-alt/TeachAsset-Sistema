using System;

namespace TechAsset.Application.DTOs
{
    public class DevolverPrestamoDto
    {
        public Guid Id { get; set; }
        public DateTime FechaDevolucion { get; set; }
        public string Observacion { get; set; } = string.Empty;
    }
}
