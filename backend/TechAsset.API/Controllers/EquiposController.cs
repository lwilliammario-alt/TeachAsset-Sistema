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
    public class EquiposController : ControllerBase
    {
        private readonly IEquipoService _service;

        public EquiposController(IEquipoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipo>>> GetAll()
        {
            var equipos = await _service.GetAllEquiposAsync();
            return Ok(equipos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipo>> GetById(Guid id)
        {
            var equipo = await _service.GetEquipoByIdAsync(id);
            if (equipo == null)
                return NotFound();
            return Ok(equipo);
        }

        [Authorize(Roles = "Admin,Tecnico")]
        [HttpPost]
        public async Task<ActionResult<Equipo>> Create(CreateEquipoDto dto)
        {
            try
            {
                var equipo = await _service.CreateEquipoAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = equipo.Id }, equipo);
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Equipo>> Update(Guid id, UpdateEquipoDto dto)
        {
            try
            {
                var equipo = await _service.UpdateEquipoAsync(id, dto);
                return Ok(equipo);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/estado")]
        public async Task<ActionResult<Equipo>> UpdateEstado(Guid id, [FromBody] string nuevoEstado)
        {
            try
            {
                var equipo = await _service.UpdateEquipoEstadoAsync(id, nuevoEstado);
                return Ok(equipo);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
