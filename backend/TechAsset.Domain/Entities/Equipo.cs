using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TechAsset.Domain.Entities
{
    public class Equipo
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string CodigoPatrimonial { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public string Estado { get; set; } = "Disponible"; // Disponible, Mantenimiento, Baja, Prestado

        // Relación con préstamos
        [JsonIgnore]
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
