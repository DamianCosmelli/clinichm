using clinichm_api.Controllers;
using clinichm_api.DTOs;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace clinichm_api.Tests
{
    public class CategoriaProdControllerTests
    {
        private readonly Mock<ICategoriaProdService> _mockService;
        private readonly CategoriaProdController _controller;

        public CategoriaProdControllerTests()
        {
            _mockService = new Mock<ICategoriaProdService>();
            _controller = new CategoriaProdController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfCategorias()
        {
            // Arrange
            var categorias = new List<CategoriaProdDTO>
            {
                new CategoriaProdDTO { Id = 1, Nombre = "Hialuronico" },
                new CategoriaProdDTO { Id = 2, Nombre = "Toxina Botulinica" }
            };
            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(categorias);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(categorias, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenCategoriaDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((CategoriaProdDTO?)null);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreatedAtActionResult_WithNewCategoria()
        {
            // Arrange
            var newCategoriaDto = new CategoriaProdReqDTO { Nombre = "Hialuronico" };
            var createdCategoria = new CategoriaProdDTO { Id = 1, Nombre = "Hialuronico" };
            _mockService.Setup(s => s.AddAsync(It.IsAny<CategoriaProdReqDTO>())).ReturnsAsync(createdCategoria);

            // Act
            var result = await _controller.Create(newCategoriaDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(createdCategoria, createdResult.Value);
        }

        [Fact]
        public async Task Update_ReturnsOkResult_WithUpdatedCategoria()
        {
            // Arrange
            var updateDto = new CategoriaProdReqDTO { Nombre = "Actualizado" };
            var updatedCategoria = new CategoriaProdDTO { Id = 1, Nombre = "Actualizado" };
            _mockService.Setup(s => s.UpdateAsync(It.IsAny<int>(), It.IsAny<CategoriaProdReqDTO>())).ReturnsAsync(updatedCategoria);

            // Act
            var result = await _controller.Update(1, updateDto);

            // Assert
            var actionResult = Assert.IsType<ActionResult<CategoriaProdDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.Equal(updatedCategoria, okResult.Value);
        }

        [Fact]
        public async Task Delete_ReturnsNoContent_WhenCategoriaIsDeleted()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}