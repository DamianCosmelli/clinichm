using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Moq;
using Xunit;

namespace clinichm_api.Tests
{
    public class ProductoServiceTests
    {
        private readonly Mock<IRepository<Producto>> _mockRepository;
        private readonly ProductoService _service;

        public ProductoServiceTests()
        {
            _mockRepository = new Mock<IRepository<Producto>>();
            _service = new ProductoService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfProductos()
        {
            // Arrange
            var productos = new List<Producto> { new Producto { Id = 1, Nombre = "Producto1" } };
            _mockRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(productos);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Single(result);
            Assert.Equal("Producto1", result.First().Nombre);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenProductoDoesNotExist()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Producto?)null);

            // Act
            var result = await _service.GetByIdAsync(1);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_CreatesNewProducto()
        {
            // Arrange
            var producto = new Producto { Id = 1, Nombre = "Producto1" };
            _mockRepository.Setup(repo => repo.AddAsync(It.IsAny<Producto>())).Callback<Producto>(p => p.Id = 1);

            // Act
            var result = await _service.AddAsync(new ProductoDTO { Nombre = "Producto1" });

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
        }
    }
}