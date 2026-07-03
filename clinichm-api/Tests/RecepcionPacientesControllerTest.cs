using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using clinichm_api.Controllers;
using clinichm_api.Services;
using clinichm_api.DTOs;

namespace clinichm_api.Tests
{
    public class RecepcionPacientesControllerTest
    {
        private readonly Mock<IRecepcionPacientesService> _serviceMock;
        private readonly RecepcionPacientesController _controller;

        public RecepcionPacientesControllerTest()
        {
            _serviceMock = new Mock<IRecepcionPacientesService>();
            _controller = new RecepcionPacientesController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfRecepcionPacientes()
        {
            // Arrange
            var expected = new List<RecepcionPacientesResponseDTO> { new RecepcionPacientesResponseDTO() };
            _serviceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(expected);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(expected, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsOkResult_WhenFound()
        {
            var dto = new RecepcionPacientesResponseDTO { Id = 1 };
            _serviceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(dto);

            var result = await _controller.GetById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(dto, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenNotFound()
        {
            _serviceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync((RecepcionPacientesResponseDTO?)null);

            var result = await _controller.GetById(1);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreatedAtAction()
        {
            var dto = new RecepcionPacientesDTO();
            var response = new RecepcionPacientesResponseDTO { Id = 2 };
            _serviceMock.Setup(s => s.AddAsync(dto)).ReturnsAsync(response);

            var result = await _controller.Create(dto);

            var createdAtAction = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(response, createdAtAction.Value);
        }

        [Fact]
        public async Task Update_ReturnsOk_WhenUpdated()
        {
            var dto = new RecepcionPacientesDTO();
            var response = new RecepcionPacientesResponseDTO { Id = 3 };
            _serviceMock.Setup(s => s.UpdateAsync(3, dto)).ReturnsAsync(response);

            var result = await _controller.Update(3, dto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenNotFound()
        {
            var dto = new RecepcionPacientesDTO();
            _serviceMock.Setup(s => s.UpdateAsync(4, dto)).ReturnsAsync((RecepcionPacientesResponseDTO?)null!);

            var result = await _controller.Update(4, dto);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenDeleted()
        {
            _serviceMock.Setup(s => s.DeleteAsync(5)).ReturnsAsync(true);

            var result = await _controller.Delete(5);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenNotFound()
        {
            _serviceMock.Setup(s => s.DeleteAsync(6)).ReturnsAsync(false);

            var result = await _controller.Delete(6);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetRecepcionXDia_ReturnsBadRequest_WhenFechaIsDefault()
        {
            var result = await _controller.GetRecepcionXDia(default);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("La fecha es obligatoria.", badRequest.Value);
        }

        [Fact]
        public async Task GetRecepcionXDia_ReturnsOk_WithPacientesDia()
        {
            var fecha = new DateTime(2024, 1, 1);
            var expected = new List<RecepcionCalendarResponseDTO> { new RecepcionCalendarResponseDTO() };
            _serviceMock.Setup(s => s.GetRecepcionXFecha(fecha)).ReturnsAsync(expected);

            var result = await _controller.GetRecepcionXDia(fecha);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(expected, okResult.Value);
        }
    }
}