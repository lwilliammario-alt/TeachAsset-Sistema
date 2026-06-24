using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IPrestamoRepository
    {
        Task AddAsync(Prestamo prestamo);
        Task<IEnumerable<Prestamo>> GetAllAsync();
        Task<Prestamo?> GetByIdAsync(Guid id);
        Task<IEnumerable<Prestamo>> GetByUsuarioIdAsync(Guid usuarioId);
        Task<IEnumerable<Prestamo>> GetByEquipoIdAsync(Guid equipoId);
        Task UpdateAsync(Prestamo prestamo);
    }
}
