using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Interfaces
{
    public interface IPrestamoService
    {
        Task<Prestamo> CreatePrestamoAsync(CreatePrestamoDto dto);
        Task<Prestamo> DevolverPrestamoAsync(DevolverPrestamoDto dto);
        Task<IEnumerable<Prestamo>> GetAllPrestamosAsync();
        Task<IEnumerable<Prestamo>> GetPrestamosByUsuarioIdAsync(Guid usuarioId);
        Task<Prestamo?> GetPrestamoByIdAsync(Guid id);
    }
}
