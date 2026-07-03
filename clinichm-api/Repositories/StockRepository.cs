using clinichm_api.Models;
using clinichm_api.Data;
using clinichm_api.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Serilog;

namespace clinichm_api.Repositories
{
    public class StockRepository : Repository<Stock>, IStockRepository
    {
        private readonly AppDbContext _context;

        public StockRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<string> DescontarStockAsync(int productoId, decimal cantidadADescontar, int sucursalId)
        {
            //Obtiene la sucrsal donde se descontara el stock
            var sucursal = await _context.Sucursales.FindAsync(sucursalId);
            //Obtiene el producto por su ID
            var producto = await _context.Producto.FindAsync(productoId);
            if (producto == null)
            {
                //throw new KeyNotFoundException("Producto no encontrado.");
                Log.Error($"Error: Producto no encontrado con ID: {productoId}");
                return "Producto no encontrado";
            }

            // Si el producto no es auto-descontable, no se realiza el descuento
            if (producto.NoAutoDescontable)
                return "No Autodescontable";

            // verifica si el producto es Toxina (CategoriaProdId == 2) 
            // Si es toxina, calcula equivalencia a viales para descontar
            if (producto.CategoriaProdId == 2)
            {
                // Leer el JSON externo con las equivalencias de toxinas
                var jsonPath = Path.Combine(AppContext.BaseDirectory, "conf", "toxinas.json");
                if (!File.Exists(jsonPath))
                {
                    //throw new FileNotFoundException("No se encontró el archivo de configuración de unidades de toxinas.", jsonPath);
                    Log.Error($"Error: No se encontró el archivo de configuración de unidades de toxinas en la ruta: {jsonPath}");
                    return "Archivo de configuración de toxinas no encontrado";
                }

                var jsonString = await File.ReadAllTextAsync(jsonPath);
                var equivalencias = JsonSerializer.Deserialize<Dictionary<string, int>>(jsonString);
                if (equivalencias == null)
                {
                    Log.Error("Error: No se pudieron cargar las equivalencias de toxinas desde el archivo JSON.");
                    return "Error al cargar equivalencias de toxinas";
                }

                var nombre = producto.Nombre.ToLower();

                if (!equivalencias.TryGetValue(nombre, out var unidad))
                {
                    //throw new InvalidOperationException("Unidad de medida no válida para descontar stock.");
                    Log.Error($"Error: Unidad de medida no válida para descontar stock del producto: {producto.Nombre}");
                    return "Unidad de medida no válida para descontar stock";
                }

                cantidadADescontar = cantidadADescontar / unidad;
            }
                
            if (cantidadADescontar <= 0)
                return "Valor no valido";
            // obtiene el stock disponible del producto en la sucursal indicada, 
            // ordenado por fecha devencimiento e ingreso (FIFO)
            var stock = await _context.Stock
                .Where(s => s.ProductoId == productoId &&
                            s.Deposito == sucursal!.Nombre &&
                            s.CantidadExistente > 0)
                .OrderBy(s => s.Vencimiento)
                .ThenBy(s => s.FechaIngreso)
                .ToListAsync();

            if (stock == null || stock.Count == 0)
            {
                //throw new InvalidOperationException("No hay stock disponible para el producto indicado.");
                Log.Error($"Advertencia: No hay stock disponible para el producto: {producto.Nombre} en la sucursal: {sucursal!.Nombre} (cant: {cantidadADescontar}).");
                return "Sin stock";
            }    

            foreach (var item in stock)
            {
                if (cantidadADescontar == 0)
                    break;

                if (item.CantidadExistente >= cantidadADescontar)
                {
                    item.CantidadExistente -= cantidadADescontar;
                    cantidadADescontar = 0;
                }
                else
                {
                    cantidadADescontar -= item.CantidadExistente;
                    item.CantidadExistente = 0;
                }
            }

            if (cantidadADescontar > 0)
            {
                //throw new InvalidOperationException("No hay suficiente stock para descontar la cantidad solicitada.");
                // Registrar en logs el problema y continuar sin interrumpir el proceso
                Log.Error($"Advertencia: No hay suficiente stock para descontar la cantidad solicitada para el producto: {producto.Nombre} en la sucursal: {sucursal!.Nombre} (cant: {cantidadADescontar}).");
                return "Sin stock";
            }

            await _context.SaveChangesAsync();
            return "Descuento realizado correctamente";
        }
    }
}