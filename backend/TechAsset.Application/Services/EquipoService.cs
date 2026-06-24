using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Services
{
    public class EquipoService : IEquipoService
    {
        private readonly IEquipoRepository _repository;

        public EquipoService(IEquipoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Equipo> CreateEquipoAsync(CreateEquipoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CodigoPatrimonial))
                throw new ArgumentException("El código patrimonial es requerido.");

            var existing = await _repository.GetByCodigoPatrimonialAsync(dto.CodigoPatrimonial);
            if (existing != null)
                throw new InvalidOperationException("El código patrimonial debe ser único.");

            var equipo = new Equipo
            {
                CodigoPatrimonial = dto.CodigoPatrimonial,
                Nombre = dto.Nombre,
                Categoria = dto.Categoria,
                Marca = dto.Marca,
                Estado = "Disponible"
            };

            await _repository.AddAsync(equipo);
            return equipo;
        }

        public async Task<IEnumerable<Equipo>> GetAllEquiposAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Equipo?> GetEquipoByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Equipo> UpdateEquipoEstadoAsync(Guid id, string nuevoEstado)
        {
            var equipo = await _repository.GetByIdAsync(id);
            if (equipo == null)
                throw new KeyNotFoundException("Equipo no encontrado.");

            equipo.Estado = nuevoEstado;
            await _repository.UpdateAsync(equipo);
            return equipo;
        }

        public async Task<Equipo> UpdateEquipoAsync(Guid id, UpdateEquipoDto dto)
        {
            var equipo = await _repository.GetByIdAsync(id);
            if (equipo == null)
                throw new KeyNotFoundException("Equipo no encontrado.");

            equipo.Nombre = dto.Nombre;
            equipo.Categoria = dto.Categoria;
            equipo.Marca = dto.Marca;
            if (!string.IsNullOrWhiteSpace(dto.Estado))
            {
                equipo.Estado = dto.Estado;
            }

            await _repository.UpdateAsync(equipo);
            return equipo;
        }
    }
}
