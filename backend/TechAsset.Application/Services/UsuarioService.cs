using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        public async Task<Usuario> CreateUsuarioAsync(CreateUsuarioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Correo))
                throw new ArgumentException("El correo es requerido.");

            var existing = await _repository.GetByCorreoAsync(dto.Correo);
            if (existing != null)
                throw new InvalidOperationException("El correo electrónico del usuario debe ser único.");

            var usuario = new Usuario
            {
                Nombres = dto.Nombres,
                Apellidos = dto.Apellidos,
                Correo = dto.Correo,
                Area = dto.Area,
                Estado = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), // Contraseña predeterminada
                Rol = "Colaborador"
            };

            await _repository.AddAsync(usuario);
            return usuario;
        }

        public async Task<IEnumerable<Usuario>> GetAllUsuariosAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Usuario?> GetUsuarioByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Usuario> ToggleUsuarioEstadoAsync(Guid id)
        {
            var usuario = await _repository.GetByIdAsync(id);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado.");

            usuario.Estado = !usuario.Estado;
            await _repository.UpdateAsync(usuario);
            return usuario;
        }

        public async Task<Usuario> UpdateUsuarioAsync(Guid id, UpdateUsuarioDto dto)
        {
            var usuario = await _repository.GetByIdAsync(id);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado.");

            if (string.IsNullOrWhiteSpace(dto.Correo))
                throw new ArgumentException("El correo es requerido.");

            if (dto.Correo != usuario.Correo)
            {
                var existing = await _repository.GetByCorreoAsync(dto.Correo);
                if (existing != null)
                    throw new InvalidOperationException("El correo electrónico del usuario debe ser único.");
            }

            usuario.Nombres = dto.Nombres;
            usuario.Apellidos = dto.Apellidos;
            usuario.Correo = dto.Correo;
            usuario.Area = dto.Area;
            usuario.Rol = dto.Rol;

            await _repository.UpdateAsync(usuario);
            return usuario;
        }
    }
}
