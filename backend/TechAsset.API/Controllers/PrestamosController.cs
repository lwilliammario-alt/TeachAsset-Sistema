using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechAsset.Application.DTOs;
using TechAsset.Application.Interfaces;
using TechAsset.Domain.Entities;

namespace TechAsset.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamosController : ControllerBase
    {
        private readonly IPrestamoService _service;

        public PrestamosController(IPrestamoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prestamo>>> GetAll()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (roleClaim?.Equals("Colaborador", StringComparison.OrdinalIgnoreCase) == true)
            {
                if (Guid.TryParse(userIdClaim, out var userId))
                {
                    var prestamos = await _service.GetPrestamosByUsuarioIdAsync(userId);
                    return Ok(prestamos);
                }
                return Forbid();
            }

            var allPrestamos = await _service.GetAllPrestamosAsync();
            return Ok(allPrestamos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Prestamo>> GetById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            var prestamo = await _service.GetPrestamoByIdAsync(id);
            if (prestamo == null)
                return NotFound();

            if (roleClaim?.Equals("Colaborador", StringComparison.OrdinalIgnoreCase) == true)
            {
                if (prestamo.UsuarioId.ToString() != userIdClaim)
                {
                    return Forbid();
                }
            }

            return Ok(prestamo);
        }

        [HttpPost]
        public async Task<ActionResult<Prestamo>> Create(CreatePrestamoDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (roleClaim?.Equals("Colaborador", StringComparison.OrdinalIgnoreCase) == true)
            {
                if (dto.UsuarioId.ToString() != userIdClaim)
                {
                    return BadRequest(new { message = "Un colaborador solo puede solicitar préstamos para sí mismo." });
                }
            }

            try
            {
                var prestamo = await _service.CreatePrestamoAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = prestamo.Id }, prestamo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Tecnico")]
        [HttpPost("devolver")]
        public async Task<ActionResult<Prestamo>> Devolver(DevolverPrestamoDto dto)
        {
            try
            {
                var prestamo = await _service.DevolverPrestamoAsync(dto);
                return Ok(prestamo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
