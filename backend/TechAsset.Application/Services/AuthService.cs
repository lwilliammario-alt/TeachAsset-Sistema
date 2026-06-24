using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<string> LoginAsync(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Correo) || string.IsNullOrWhiteSpace(dto.Password))
                throw new ArgumentException("El correo y la contraseña son requeridos.");

            var usuario = await _usuarioRepository.GetByCorreoAsync(dto.Correo);
            if (usuario == null || !usuario.Estado)
                throw new InvalidOperationException("Credenciales inválidas o usuario deshabilitado.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash);
            if (!isPasswordValid)
                throw new InvalidOperationException("Credenciales inválidas.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var secret = _configuration["Jwt:Secret"] ?? "ClaveSuperSecretaDeMasDeTreintaYDosBytesDeLargoParaSeguridadJWT!";
            var key = Encoding.UTF8.GetBytes(secret);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{usuario.Nombres} {usuario.Apellidos}"),
                new Claim(ClaimTypes.Email, usuario.Correo),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim("area", usuario.Area)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"] ?? "TechAssetServer",
                Audience = _configuration["Jwt:Audience"] ?? "TechAssetClient"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<Usuario> RegisterAsync(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Correo) || string.IsNullOrWhiteSpace(dto.Password))
                throw new ArgumentException("El correo y la contraseña son obligatorios.");

            var existing = await _usuarioRepository.GetByCorreoAsync(dto.Correo);
            if (existing != null)
                throw new InvalidOperationException("El correo electrónico ya está registrado.");

            var usuario = new Usuario
            {
                Nombres = dto.Nombres,
                Apellidos = dto.Apellidos,
                Correo = dto.Correo,
                Area = dto.Area,
                Rol = dto.Rol,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Estado = true
            };

            await _usuarioRepository.AddAsync(usuario);
            return usuario;
        }
    }
}
