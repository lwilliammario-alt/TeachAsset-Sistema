using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario> CreateUsuarioAsync(CreateUsuarioDto dto);
        Task<IEnumerable<Usuario>> GetAllUsuariosAsync();
        Task<Usuario?> GetUsuarioByIdAsync(Guid id);
        Task<Usuario> ToggleUsuarioEstadoAsync(Guid id);
        Task<Usuario> UpdateUsuarioAsync(Guid id, UpdateUsuarioDto dto);
    }
}
