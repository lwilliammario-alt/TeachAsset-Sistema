using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;
using TechAsset.Infrastructure.Data;

namespace TechAsset.Infrastructure.Repositories
{
    public class EquipoRepository : IEquipoRepository
    {
        private readonly AppDbContext _context;

        public EquipoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Equipo equipo)
        {
            await _context.Equipos.AddAsync(equipo);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Equipo>> GetAllAsync()
        {
            return await _context.Equipos.ToListAsync();
        }

        public async Task<Equipo?> GetByIdAsync(Guid id)
        {
            return await _context.Equipos.FindAsync(id);
        }

        public async Task<Equipo?> GetByCodigoPatrimonialAsync(string codigo)
        {
            return await _context.Equipos.FirstOrDefaultAsync(e => e.CodigoPatrimonial == codigo);
        }

        public async Task UpdateAsync(Equipo equipo)
        {
            _context.Equipos.Update(equipo);
            await _context.SaveChangesAsync();
        }
    }
}
