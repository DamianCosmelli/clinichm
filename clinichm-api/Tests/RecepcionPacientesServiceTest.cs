using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services.Implements;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace clinichm_api.Tests
{
    public class RecepcionPacientesServiceTest
    {
        private readonly Mock<IRepository<RecepcionPacientes>> _repositoryMock;
        private readonly AppDbContext _context;
        private readonly RecepcionPacientesService _service;

        public RecepcionPacientesServiceTest()
        {
            _repositoryMock = new Mock<IRepository<RecepcionPacientes>>();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new AppDbContext(options);
            _service = new RecepcionPacientesService(_repositoryMock.Object, _context);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfRecepcionPacientesResponseDTO()
        {
            // Arrange
            var recepcionList = new List<RecepcionPacientes>
            {
                new RecepcionPacientes { Id = 1, PacienteId = 1, TratamientoId = 1, MedicoId = 1, HoraIngreso = DateTime.Now, EstadoRecepcion = "Activo", EsConsulta = false, Piso = 1, SucursalId = 1, EsRetoque = false, MotivoConsulta = "Consulta" }
            };
            _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(recepcionList);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsRecepcionPacientesResponseDTO_WhenFound()
        {
            // Arrange
            var recepcion = new RecepcionPacientes { Id = 2, PacienteId = 2, TratamientoId = 2, MedicoId = 2, HoraIngreso = DateTime.Now, EstadoRecepcion = "Activo", EsConsulta = true, Piso = 2, SucursalId = 2, EsRetoque = true, MotivoConsulta = "Motivo" };
            _repositoryMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(recepcion);

            // Act
            var result = await _service.GetByIdAsync(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Id);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((RecepcionPacientes?)null);

            var result = await _service.GetByIdAsync(99);

            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_AddsAndReturnsRecepcionPacientesResponseDTO()
        {
            // Arrange
            var dto = new RecepcionPacientesDTO
            {
                PacienteId = 3,
                TratamientoId = 3,
                MedicoId = 3,
                HoraIngreso = DateTime.Now,
                EstadoRecepcion = "Pendiente",
                EsConsulta = false,
                Piso = 3,
                SucursalId = 3,
                EsRetoque = false,
                MotivoConsulta = "Motivo"
            };
            _repositoryMock.Setup(r => r.AddAsync(It.IsAny<RecepcionPacientes>()))
                .Callback<RecepcionPacientes>(rp => rp.Id = 10)
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(10, result.Id);
            Assert.Equal(dto.PacienteId, result.PacienteId);
        }

        [Fact]
        public async Task UpdateAsync_UpdatesAndReturnsRecepcionPacientesResponseDTO_WhenFound()
        {
            // Arrange
            var recepcion = new RecepcionPacientes { Id = 4, PacienteId = 4, TratamientoId = 4, MedicoId = 4, HoraIngreso = DateTime.Now, EstadoRecepcion = "Activo", EsConsulta = false, Piso = 4, SucursalId = 4, EsRetoque = false, MotivoConsulta = "Motivo" };
            var dto = new RecepcionPacientesDTO
            {
                PacienteId = 5,
                TratamientoId = 5,
                MedicoId = 5,
                HoraIngreso = DateTime.Now,
                EstadoRecepcion = "Actualizado",
                EsConsulta = true,
                Piso = 5,
                SucursalId = 5,
                EsRetoque = true,
                MotivoConsulta = "Nuevo Motivo"
            };
            _repositoryMock.Setup(r => r.GetByIdAsync(4)).ReturnsAsync(recepcion);
            _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<RecepcionPacientes>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.UpdateAsync(4, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(4, result.Id);
            Assert.Equal(dto.PacienteId, result.PacienteId);
        }

        [Fact]
        public async Task UpdateAsync_ReturnsNull_WhenNotFound()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((RecepcionPacientes?)null);

            var dto = new RecepcionPacientesDTO();
            var result = await _service.UpdateAsync(99, dto);

            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_DeletesAndReturnsTrue_WhenFound()
        {
            var recepcion = new RecepcionPacientes { Id = 6 };
            _repositoryMock.Setup(r => r.GetByIdAsync(6)).ReturnsAsync(recepcion);
            _repositoryMock.Setup(r => r.DeleteAsync(6)).Returns(Task.CompletedTask);

            var result = await _service.DeleteAsync(6);

            Assert.True(result);
        }

        [Fact]
        public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
        {
            _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((RecepcionPacientes?)null);

            var result = await _service.DeleteAsync(99);

            Assert.False(result);
        }
    }
}