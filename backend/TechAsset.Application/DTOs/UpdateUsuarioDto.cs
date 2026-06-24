namespace TechAsset.Application.DTOs
{
    public class UpdateUsuarioDto
    {
        public string Nombres { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string Rol { get; set; } = "Colaborador";
    }
}
