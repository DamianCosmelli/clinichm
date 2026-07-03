using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using clinichm_api.Services;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace clinichm_api.Tests
{
    public class CategoriaProdServiceTests
    {
        private readonly Mock<IRepository<CategoriaProd>> _mockRepository;
        private readonly CategoriaProdService _service;

        public CategoriaProdServiceTests()
        {
            _mockRepository = new Mock<IRepository<CategoriaProd>>();
            _service = new CategoriaProdService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfCategorias()
        {
            // Arrange
            var categorias = new List<CategoriaProd>
            {
                new CategoriaProd { Id = 1, Nombre = "Hialuronico" },
                new CategoriaProd { Id = 2, Nombre = "Toxina Botulinica" }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(categorias);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsCategoria_WhenExists()
        {
            // Arrange
            var categoria = new CategoriaProd { Id = 1, Nombre = "Hialuronico" };
            _mockRepository.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(categoria);

            // Act
            var result = await _service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Hialuronico", result!.Nombre);
        }

        [Fact]
        public async Task AddAsync_AddsCategoriaAndReturnsIt()
        {
            // Arrange
            var categoriaDto = new CategoriaProdReqDTO { Nombre = "Hialuronico" };
            var categoria = new CategoriaProd { Id = 1, Nombre = "Hialuronico" };
            _mockRepository.Setup(r => r.AddAsync(It.IsAny<CategoriaProd>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.AddAsync(categoriaDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Hialuronico", result!.Nombre);
        }

        [Fact]
        public async Task DeleteAsync_ReturnsTrue_WhenCategoriaIsDeleted()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(new CategoriaProd { Id = 1 });
            _mockRepository.Setup(r => r.DeleteAsync(It.IsAny<int>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.DeleteAsync(1);

            // Assert
            Assert.True(result);
        }
    }
}