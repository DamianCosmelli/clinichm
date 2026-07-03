using clinichm_api.DTOs;
using clinichm_api.Models;
using clinichm_api.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace clinichm_api.Services.Implements
{
    public class StockService : IStockService
    {
        private readonly IStockRepository _stockRepository;

        public StockService(IStockRepository repository)
        {
            _stockRepository = repository;
        }

        public async Task<IEnumerable<StockResponseDTO>> GetAllAsync()
        {
            var stocks = await _stockRepository.GetAllAsync();
            return stocks.Select(s => new StockResponseDTO
            {
                Id = s.Id,
                ProductoId = s.ProductoId,
                Lote = s.Lote,
                Vencimiento = s.Vencimiento,
                CantidadIngreso = s.CantidadIngreso,
                CantidadExistente = s.CantidadExistente,
                FechaIngreso = s.FechaIngreso,
                Deposito = s.Deposito,
                TipoOperacion=s.TipoOperacion
            }).ToList();
        }

        public async Task<StockResponseDTO?> GetByIdAsync(int id)
        {
            var s = await _stockRepository.GetByIdAsync(id);
            if (s == null) return null;
            return new StockResponseDTO
            {
                Id = s.Id,
                ProductoId = s.ProductoId,
                Lote = s.Lote,
                Vencimiento = s.Vencimiento,
                CantidadIngreso = s.CantidadIngreso,
                CantidadExistente = s.CantidadExistente,
                FechaIngreso = s.FechaIngreso,
                Deposito = s.Deposito,
                TipoOperacion=s.TipoOperacion
            };
        }

        public async Task<StockResponseDTO> AddAsync(StockDTO dto)
        {
            var s = new Stock
            {
                ProductoId = dto.ProductoId,
                Lote = dto.Lote,
                Vencimiento = dto.Vencimiento,
                CantidadIngreso = dto.CantidadIngreso,
                CantidadExistente = dto.CantidadExistente,
                FechaIngreso = dto.FechaIngreso,
                Deposito = dto.Deposito,
                TipoOperacion= dto.TipoOperacion
            };
            await _stockRepository.AddAsync(s);
            return new StockResponseDTO
            {
                Id = s.Id,
                ProductoId = s.ProductoId,
                Lote = s.Lote,
                Vencimiento = s.Vencimiento,
                CantidadIngreso = s.CantidadIngreso,
                CantidadExistente = s.CantidadExistente,
                FechaIngreso = s.FechaIngreso,
                Deposito = s.Deposito,
                TipoOperacion=s.TipoOperacion
            };
        }

        public async Task<StockResponseDTO> UpdateAsync(int id, StockDTO dto)
        {
            var s = await _stockRepository.GetByIdAsync(id);
            if (s == null) return null!;
            s.ProductoId = dto.ProductoId;
            s.Lote = dto.Lote;
            s.Vencimiento = dto.Vencimiento;
            s.CantidadIngreso = dto.CantidadIngreso;
            s.CantidadExistente = dto.CantidadExistente;
            s.FechaIngreso = dto.FechaIngreso;
            s.Deposito = dto.Deposito;
            s.TipoOperacion = dto.TipoOperacion;
            await _stockRepository.UpdateAsync(s);
            return new StockResponseDTO
            {
                Id = s.Id,
                ProductoId = s.ProductoId,
                Lote = s.Lote,
                Vencimiento = s.Vencimiento,
                CantidadIngreso = s.CantidadIngreso,
                CantidadExistente = s.CantidadExistente,
                FechaIngreso = s.FechaIngreso,
                Deposito = s.Deposito,
                TipoOperacion= s.TipoOperacion
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var s = await _stockRepository.GetByIdAsync(id);
            if (s == null) return false;
            await _stockRepository.DeleteAsync(id);
            return true;
        }
    }
}
