using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IEquipoService
    {
        Task<Equipo> CreateEquipoAsync(CreateEquipoDto dto);
        Task<IEnumerable<Equipo>> GetAllEquiposAsync();
        Task<Equipo?> GetEquipoByIdAsync(Guid id);
        Task<Equipo> UpdateEquipoEstadoAsync(Guid id, string nuevoEstado);
        Task<Equipo> UpdateEquipoAsync(Guid id, UpdateEquipoDto dto);
    }
}
