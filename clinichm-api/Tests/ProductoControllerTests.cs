using clinichm_api.Controllers;
using clinichm_api.DTOs;
using clinichm_api.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace clinichm_api.Tests
{
    public class ProductoControllerTests
    {
        private readonly Mock<IProductoService> _mockService;
        private readonly ProductoController _controller;

        public ProductoControllerTests()
        {
            _mockService = new Mock<IProductoService>();
            _controller = new ProductoController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfProductos()
        {
            // Arrange
            var productos = new List<ProductoDTO> { 
                new ProductoDTO { Id = 1, Nombre = "Producto1" },
                new ProductoDTO { Id = 2, Nombre = "Producto2" },
                };
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(productos);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(productos, okResult.Value);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenProductoDoesNotExist()
        {
            // Arrange
            _mockService.Setup(service => service.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((ProductoDTO?)null);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_ReturnsCreatedAtActionResult_WithNewProducto()
        {
            // Arrange
            var newProducto = new ProductoDTO { Id = 1, Nombre = "Producto1" };
            _mockService.Setup(service => service.AddAsync(It.IsAny<ProductoDTO>())).ReturnsAsync(newProducto);

            // Act
            var result = await _controller.Create(newProducto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<ProductoDTO>(createdResult.Value);
            Assert.Equal(newProducto.Id, returnValue.Id);
        }
    }
}