using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;

namespace TechAsset.Application.Services
{
    public class PrestamoService : IPrestamoService
    {
        private readonly IPrestamoRepository _prestamoRepository;
        private readonly IEquipoRepository _equipoRepository;
        private readonly IUsuarioRepository _usuarioRepository;

        public PrestamoService(
            IPrestamoRepository prestamoRepository,
            IEquipoRepository equipoRepository,
            IUsuarioRepository usuarioRepository)
        {
            _prestamoRepository = prestamoRepository;
            _equipoRepository = equipoRepository;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<Prestamo> CreatePrestamoAsync(CreatePrestamoDto dto)
        {
            // RN-05: Todo préstamo debe registrar un responsable (UsuarioId)
            var usuario = await _usuarioRepository.GetByIdAsync(dto.UsuarioId);
            if (usuario == null)
                throw new ArgumentException("El usuario responsable no existe.");

            if (!usuario.Estado)
                throw new InvalidOperationException("No se puede registrar un préstamo a un usuario deshabilitado.");

            var equipo = await _equipoRepository.GetByIdAsync(dto.EquipoId);
            if (equipo == null)
                throw new ArgumentException("El equipo no existe.");

            // RN-02: No se puede prestar un equipo en estado “Mantenimiento”
            if (equipo.Estado.Equals("Mantenimiento", StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("No se puede prestar un equipo en estado 'Mantenimiento'.");

            // RN-03: No se puede prestar un equipo en estado “Baja”
            if (equipo.Estado.Equals("Baja", StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("No se puede prestar un equipo en estado 'Baja'.");

            // RN-01: Un equipo solo puede estar asociado a un préstamo activo
            if (equipo.Estado.Equals("Prestado", StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("El equipo ya cuenta con un préstamo activo.");

            var prestamo = new Prestamo
            {
                UsuarioId = dto.UsuarioId,
                EquipoId = dto.EquipoId,
                FechaPrestamo = dto.FechaPrestamo.Date,
                Observacion = dto.Observacion
            };

            // Cambiar estado del equipo a Prestado
            equipo.Estado = "Prestado";
            await _equipoRepository.UpdateAsync(equipo);

            await _prestamoRepository.AddAsync(prestamo);
            return prestamo;
        }

        public async Task<Prestamo> DevolverPrestamoAsync(DevolverPrestamoDto dto)
        {
            var prestamo = await _prestamoRepository.GetByIdAsync(dto.Id);
            if (prestamo == null)
                throw new KeyNotFoundException("Préstamo no encontrado.");

            if (prestamo.FechaDevolucion.HasValue)
                throw new InvalidOperationException("Este préstamo ya fue devuelto.");

            // RN-04: La fecha de devolución debe ser posterior o igual a la fecha de préstamo
            if (dto.FechaDevolucion.Date < prestamo.FechaPrestamo.Date)
                throw new InvalidOperationException("La fecha de devolución debe ser posterior o igual a la fecha de préstamo.");

            // RN-10: Toda devolución deberá registrar observaciones
            if (string.IsNullOrWhiteSpace(dto.Observacion))
                throw new ArgumentException("Debe registrar observaciones para la devolución.");

            prestamo.FechaDevolucion = dto.FechaDevolucion.Date;
            prestamo.Observacion = dto.Observacion;

            // Cambiar estado del equipo a Disponible
            var equipo = await _equipoRepository.GetByIdAsync(prestamo.EquipoId);
            if (equipo != null)
            {
                equipo.Estado = "Disponible";
                await _equipoRepository.UpdateAsync(equipo);
            }

            await _prestamoRepository.UpdateAsync(prestamo);
            return prestamo;
        }

        public async Task<IEnumerable<Prestamo>> GetAllPrestamosAsync()
        {
            return await _prestamoRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Prestamo>> GetPrestamosByUsuarioIdAsync(Guid usuarioId)
        {
            return await _prestamoRepository.GetByUsuarioIdAsync(usuarioId);
        }

        public async Task<Prestamo?> GetPrestamoByIdAsync(Guid id)
        {
            return await _prestamoRepository.GetByIdAsync(id);
        }
    }
}
