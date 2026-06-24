using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IUsuarioRepository
    {
        Task AddAsync(Usuario usuario);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(Guid id);
        Task<Usuario?> GetByCorreoAsync(string correo);
        Task UpdateAsync(Usuario usuario);
    }
}
