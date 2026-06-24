using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Infrastructure.Repositories
{
    public class PrestamoRepository : IPrestamoRepository
    {
        private readonly AppDbContext _context;

        public PrestamoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Prestamo prestamo)
        {
            await _context.Prestamos.AddAsync(prestamo);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Prestamo>> GetAllAsync()
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Equipo)
                .OrderByDescending(p => p.FechaPrestamo)
                .ToListAsync();
        }

        public async Task<Prestamo?> GetByIdAsync(Guid id)
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Equipo)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Prestamo>> GetByUsuarioIdAsync(Guid usuarioId)
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Equipo)
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prestamo>> GetByEquipoIdAsync(Guid equipoId)
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Where(p => p.EquipoId == equipoId)
                .ToListAsync();
        }

        public async Task UpdateAsync(Prestamo prestamo)
        {
            _context.Prestamos.Update(prestamo);
            await _context.SaveChangesAsync();
        }
    }
}
