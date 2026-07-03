using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using clinichm_api.Data;
using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace clinichm_api.Tests
{
    public class TurnoServicesTests
    {
        private readonly Mock<IRepository<Turnos>> _repositoryMock;
        private readonly Mock<ITurnoRepository> _turnoRepositoryMock;
        private readonly AppDbContext _contextMock;
        private readonly TurnoServices _turnoServices;

        public TurnoServicesTests()
        {
            _repositoryMock = new Mock<IRepository<Turnos>>();
            _turnoRepositoryMock = new Mock<ITurnoRepository>();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _contextMock = new AppDbContext(options);
            _turnoServices = new TurnoServices(_repositoryMock.Object, _turnoRepositoryMock.Object, _contextMock);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnTurnos()
        {
            // Arrange
            var turnos = new List<Turnos>
            {
                new Turnos { Id = 1, PacienteId = 1, FechaHora = DateTime.Now },
                new Turnos { Id = 2, PacienteId = 2, FechaHora = DateTime.Now.AddDays(1) }
            };
            _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(turnos);

            // Act
            var result = await _turnoServices.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnTurno_WhenTurnoExists()
        {
            // Arrange
            var turno = new Turnos { Id = 1, PacienteId = 1, FechaHora = DateTime.Now };
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(turno);

            // Act
            var result = await _turnoServices.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenTurnoDoesNotExist()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Turnos?)null);

            // Act
            var result = await _turnoServices.GetByIdAsync(1);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddTurno()
        {
            // Arrange
            var turnoDto = new TurnoDTO
            {
                PacienteId = 1,
                FechaHora = DateTime.Now
            };
            var turno = new Turnos
            {
                Id = 1,
                PacienteId = 1,
                FechaHora = DateTime.Now
            };
            _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Turnos>())).Callback<Turnos>(t => t.Id = 1);

            // Act
            var result = await _turnoServices.AddAsync(turnoDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateTurno_WhenTurnoExists()
        {
            // Arrange
            var turno = new Turnos { Id = 1, PacienteId = 1, FechaHora = DateTime.Now };
            var turnoDto = new TurnoDTO { PacienteId = 2, FechaHora = DateTime.Now.AddDays(1) };
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(turno);

            // Act
            var result = await _turnoServices.UpdateAsync(1, turnoDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.PacienteId);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenTurnoDoesNotExist()
        {
            // Arrange
            var turnoDto = new TurnoDTO { PacienteId = 2, FechaHora = DateTime.Now.AddDays(1) };
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Turnos?)null);

            // Act
            var result = await _turnoServices.UpdateAsync(1, turnoDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnTrue_WhenTurnoExists()
        {
            // Arrange
            var turno = new Turnos { Id = 1 };
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(turno);

            // Act
            var result = await _turnoServices.DeleteAsync(1);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenTurnoDoesNotExist()
        {
            // Arrange
            _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((Turnos?)null);

            // Act
            var result = await _turnoServices.DeleteAsync(1);

            // Assert
            Assert.False(result);
        }
    }
}