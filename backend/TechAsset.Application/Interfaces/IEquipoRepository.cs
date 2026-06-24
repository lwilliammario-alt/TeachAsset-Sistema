using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IEquipoRepository
    {
        Task AddAsync(Equipo equipo);
        Task<IEnumerable<Equipo>> GetAllAsync();
        Task<Equipo?> GetByIdAsync(Guid id);
        Task<Equipo?> GetByCodigoPatrimonialAsync(string codigo);
        Task UpdateAsync(Equipo equipo);
    }
}
