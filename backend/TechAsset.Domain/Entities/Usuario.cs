using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TechAsset.Domain.Entities
{
    public class Usuario
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nombres { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public bool Estado { get; set; } = true; // true = Activo, false = Deshabilitado
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = "Colaborador"; // Admin, Tecnico, Colaborador

        // Relación con préstamos
        [JsonIgnore]
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
