
using System.Collections;
using System.Reflection;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using clinichm_api.Data;
using Serilog;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using clinichm_api.DTOs;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Bibliography;

namespace clinichm_api.Services
{
    public class ExcelServices : IExcelService
    {
        private readonly AppDbContext _context;

        public ExcelServices(AppDbContext context)
        {
            _context = context;
        }
        public FileContentResult GenerarExcelModelo(string modelo)
        {
            try
            {
                Type? tipoModelo = ObtenerModelo(modelo);
                if (tipoModelo == null)
                    throw new Exception($"El modelo '{modelo}' no existe.");

                Log.Information($"Modelo Solicitado: {tipoModelo.FullName}");

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add(modelo);
                    var propiedades = tipoModelo.GetProperties()    // se agrega que no concidere el campo Id
                    .Where(p => !p.Name.Equals("Id", StringComparison.OrdinalIgnoreCase))
                    .ToArray();

                    for (int col = 0; col < propiedades.Length; col++)
                    {
                        worksheet.Cell(1, col + 1).Value = propiedades[col].Name;
                        worksheet.Cell(1, col + 1).Style.Font.Bold = true;
                    }

                    worksheet.Columns().AdjustToContents();

                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        stream.Position = 0;
                        return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                        {
                            FileDownloadName = $"{modelo}_Plantilla.xlsx"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al generar el archivo Excel.");
                throw;
            }
        }

        public async Task<(int, List<object>)> CargarMasivoExcel(string modelo, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new Exception("El archivo es obligatorio.");

                Type? tipoModelo = ObtenerModelo(modelo);
                if (tipoModelo == null)
                    throw new Exception($"El modelo '{modelo}' no existe.");

                Console.WriteLine($"Modelo encontrado: {tipoModelo?.FullName}");

                // Obtenemos la lista tipada
                var listaObjetos = CargarModeloTipado(tipoModelo!);
                if (listaObjetos == null)
                    throw new Exception("No se pudo crear la lista de objetos.");

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheets.FirstOrDefault();
                        if (worksheet == null)
                            throw new Exception("El archivo no tiene hojas.");

                        var propiedades = tipoModelo!.GetProperties();
                        var headers = worksheet.Row(1).Cells().Select(c => c.Value.ToString()).ToList();
                        int rowCount = worksheet.LastRowUsed()?.RowNumber() ?? 0;

                        if (rowCount < 2)
                            throw new Exception("El archivo Excel no tiene datos válidos.");

                        for (int row = 2; row <= rowCount; row++) // Desde fila 2 (evita encabezados)
                        {
                            var instancia = Activator.CreateInstance(tipoModelo);
                            if (instancia == null)
                                throw new Exception("No se pudo crear la instancia del modelo.");

                            for (int col = 0; col < headers.Count; col++)
                            {
                                var prop = propiedades.FirstOrDefault(p => p.Name.Equals(headers[col], StringComparison.OrdinalIgnoreCase));
                                if (prop == null)
                                    continue; // Ignorar columnas desconocidas

                                var celda = worksheet.Cell(row, col + 1);
                                if (celda == null)
                                    continue;

                                object? valor = ConvertirValor(prop.PropertyType, celda.Value);
                                if (valor == null && prop.PropertyType.IsValueType)
                                    valor = Activator.CreateInstance(prop.PropertyType); // Valor por defecto

                                prop.SetValue(instancia, valor);
                            }
                            listaObjetos.Add(instancia);
                        }
                    }
                }

                // Usamos el método de DbContext.Set<T>() directamente para obtener el DbSet tipado
                var dbSetMethod = typeof(AppDbContext).GetMethod("Set", Type.EmptyTypes)?.MakeGenericMethod(tipoModelo);
                if (dbSetMethod == null)
                    throw new Exception("No se encontró el método Set<T>() en el DbContext.");

                var dbSet = dbSetMethod.Invoke(_context, null);
                if (dbSet == null)
                    throw new Exception("No se pudo acceder al DbSet del modelo.");

                // Llamamos al método Add
                var addMethod = dbSet.GetType().GetMethod("Add");
                if (addMethod == null)
                    throw new Exception("No se encontró un método Add válido en el DbSet.");

                var errores = new List<object>(); // Lista de Registro con errores
                int registrosExitosos = 0;

                foreach (var objeto in listaObjetos)
                {
                    try
                    {
                        addMethod.Invoke(dbSet, new[] { objeto });
                        await _context.SaveChangesAsync();
                        registrosExitosos++;
                    }
                    catch (DbUpdateException ex)
                    {
                        errores.Add(new { objeto, error = ex.InnerException?.Message ?? ex.Message });
                        _context.Entry(objeto).State = EntityState.Detached;
                    }
                }

                Log.Information($"{registrosExitosos} registros cargados en {modelo} con éxito. {errores.Count} errores registrados.");
                if (errores.Count > 0)
                    Log.Error("Errores en la carga masiva: {@Errores}", errores);
                return (registrosExitosos, errores);


            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al cargar datos masivamente.");
                throw;
            }
        }

        public FileContentResult GenerarExcelReporteCierre(CierreCajaReporteDTO reporte)
        {
            try
            {
                using var workbook = new XLWorkbook();

                /************ Hoja Resumen ************/
                var resumenSheet = workbook.Worksheets.Add("Resumen");
                var resumen = reporte.Resumen;

                resumenSheet.Cell(2, 1).Value = "Resumen Cierre de Caja";
                resumenSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                resumenSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16

                resumenSheet.Cell(3, 1).Value = "Sucursal";
                resumenSheet.Cell(3, 2).Value = reporte.Movimientos![0].Sucursal;
                resumenSheet.Cell(4, 1).Value = "Fecha";
                resumenSheet.Cell(4, 2).Value = reporte.Resumen!.FechaHora;
                resumenSheet.Range("A3:B4").Style.Font.Italic = true; // en italicas
                resumenSheet.Cell(4, 2).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";



                var resumenData = new Dictionary<string, object>
                                {
                                    { "Monto Efectivo", Math.Round(reporte.Resumen!.MontoEfectivo, 2) },
                                    { "Monto Tarjeta", Math.Round(reporte.Resumen!.MontoTarjetaCredito, 2) },
                                    { "Monto Debito", Math.Round(reporte.Resumen!.MontoDebito, 2) },
                                    { "Monto Transferencia", Math.Round(reporte.Resumen!.MontoTransferencia, 2) },
                                    { "Monto Dólar", Math.Round(reporte.Resumen!.MontoDolar, 2) },
                                    { "Total Efectivo", Math.Round(reporte.Resumen!.TotalEfectivo, 2) },
                                    { "Total Cuenta Clinichm", Math.Round(reporte.Resumen!.TotalCuentaClinichm, 2) },
                                    { "Total Retiro", Math.Round(reporte.Resumen!.TotalRetiro, 2) },
                                    { "Total Vuelto", Math.Round(reporte.Resumen!.TotalVuelto, 2) },
                                    { "Total Sin Cargo", Math.Round(reporte.Resumen!.TotalSinCargo, 2) },
                                    { "Total Voucher", Math.Round(reporte.Resumen!.TotalVoucher, 2) },
                                    { "Cant Voucher", reporte.Resumen!.CantVoucher },
                                };

                int row = 6;
                foreach (var item in resumenData)
                {
                    resumenSheet.Cell(row, 1).Value = item.Key;
                    resumenSheet.Cell(row, 3).SetValue(Convert.ToDecimal(item.Value));
                    row++;
                }
                ////Estilos de columnas                
                resumenSheet.Column(1).Style.Font.Italic = true; // en italicas
                resumenSheet.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right; // alinea columna a la derecha\]
                resumenSheet.Range("C6:C16").Style.NumberFormat.Format = "$ #,##0.00"; // Formato de moneda
                resumenSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                /************** Hoja Movimientos **************/
                var detalleSheet = workbook.Worksheets.Add("Movimientos");

                //Headers
                detalleSheet.Cell(2, 1).Value = "Detalles de Movimientos";
                detalleSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                detalleSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los movimientos
                detalleSheet.Cell(4, 1).Value = "Fecha";
                detalleSheet.Cell(4, 2).Value = "Sucursal";
                detalleSheet.Cell(4, 3).Value = "Medico";
                detalleSheet.Cell(4, 4).Value = "Paciente";
                detalleSheet.Cell(4, 5).Value = "Paciente DNI";
                detalleSheet.Cell(4, 6).Value = "Tratamientos";
                detalleSheet.Cell(4, 7).Value = "Tipo Movimiento";
                detalleSheet.Cell(4, 8).Value = "Medio de Pago";
                detalleSheet.Cell(4, 9).Value = "Monto";
                detalleSheet.Cell(4, 10).Value = "Número de Factura";
                detalleSheet.Cell(4, 11).Value = "Fecha Hora Transferencia";
                detalleSheet.Cell(4, 12).Value = "Empleado";
                detalleSheet.Cell(4, 13).Value = "Descripción Retiro";
                detalleSheet.Cell(4, 14).Value = "Notas";

                for (int i = 0; i < reporte.Movimientos!.Count; i++)
                {
                    var d = reporte.Movimientos![i];
                    detalleSheet.Cell(i + 5, 1).Value = d.FechaHora;
                    detalleSheet.Cell(i + 5, 2).Value = d.Sucursal;
                    detalleSheet.Cell(i + 5, 3).Value = d.Medico;
                    detalleSheet.Cell(i + 5, 4).Value = d.Paciente;
                    detalleSheet.Cell(i + 5, 5).Value = d.PacienteDNI;
                    detalleSheet.Cell(i + 5, 6).Value = d.Tratamientos;
                    detalleSheet.Cell(i + 5, 7).Value = d.TipoMovimiento;
                    detalleSheet.Cell(i + 5, 8).Value = d.MedioPago;
                    detalleSheet.Cell(i + 5, 9).Value = d.Monto;
                    detalleSheet.Cell(i + 5, 10).Value = d.NumeroFactura?.ToUpper();
                    detalleSheet.Cell(i + 5, 11).Value = d.FechaHoraTransf;
                    detalleSheet.Cell(i + 5, 12).Value = d.Empleado;
                    detalleSheet.Cell(i + 5, 13).Value = d.DescripcionRetiro;
                    detalleSheet.Cell(i + 5, 14).Value = d.Notas;                    
                }
                //Estilos de columnas
                // Encabezados en negrita
                var detalleHeader = detalleSheet.Range("A4:N4");
                detalleHeader.Style.Font.Bold = true;
                detalleSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                detalleSheet.Column(9).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                detalleSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                detalleSheet.Range("A4:N4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatos = detalleSheet.Range("A4:N1000");
                rangoDatos.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                /************** Hoja Comisiones **************/
                var comisionesSheet = workbook.Worksheets.Add("Comisiones");

                //Headers
                comisionesSheet.Cell(2, 1).Value = "Detalles de Comisiones";
                comisionesSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                comisionesSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los comisiones
                comisionesSheet.Cell(4, 1).Value = "Fecha";
                comisionesSheet.Cell(4, 2).Value = "Sucursal";
                comisionesSheet.Cell(4, 3).Value = "Medico";
                comisionesSheet.Cell(4, 4).Value = "Medio de Pago";
                comisionesSheet.Cell(4, 5).Value = "Monto";

                for (int i = 0; i < reporte.Comisiones!.Count; i++)
                {
                    var d = reporte.Comisiones![i];
                    comisionesSheet.Cell(i + 5, 1).Value = d.FechaDePago;
                    comisionesSheet.Cell(i + 5, 2).Value = resumen?.Sucursal;
                    comisionesSheet.Cell(i + 5, 3).Value = d.Medico;
                    comisionesSheet.Cell(i + 5, 4).Value = d.MetodoDePago;
                    comisionesSheet.Cell(i + 5, 5).Value = d.Monto;

                }
                //Estilos de columnas
                // Encabezados en negrita
                var comisionesHeader = comisionesSheet.Range("A4:N4");
                comisionesHeader.Style.Font.Bold = true;
                comisionesSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                comisionesSheet.Column(4).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                comisionesSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                comisionesSheet.Range("A4:E4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatosComision = comisionesSheet.Range("A4:N1000");
                rangoDatosComision.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                /************** Hoja Productos **************/
                var productosSheet = workbook.Worksheets.Add("Productos");

                //Headers
                productosSheet.Cell(2, 1).Value = "Detalles de Productos";
                productosSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                productosSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los productos
                productosSheet.Cell(4, 1).Value = "Fecha";
                productosSheet.Cell(4, 2).Value = "Sucursal";
                productosSheet.Cell(4, 3).Value = "Medico";
                productosSheet.Cell(4, 4).Value = "Producto";
                productosSheet.Cell(4, 5).Value = "Cantidad";

                for (int i = 0; i < reporte.Productos!.Count; i++)
                {
                    var d = reporte.Productos![i];
                    productosSheet.Cell(i + 5, 1).Value = d.Fecha;
                    productosSheet.Cell(i + 5, 2).Value = resumen?.Sucursal;
                    productosSheet.Cell(i + 5, 3).Value = d.Medico;
                    productosSheet.Cell(i + 5, 4).Value = d.Producto;
                    productosSheet.Cell(i + 5, 5).Value = d.CantProd;

                }
                //Estilos de columnas
                // Encabezados en negrita
                var productoHeader = productosSheet.Range("A4:N4");
                productoHeader.Style.Font.Bold = true;
                productosSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                productosSheet.Column(5).Style.NumberFormat.Format = "#,##0.00"; // Monto 
                productosSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                productosSheet.Range("A4:E4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatosProd = productosSheet.Range("A4:N1000");
                rangoDatosProd.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;


                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Seek(0, SeekOrigin.Begin);

                var fechaStr = reporte.Resumen.FechaHora.ToString("yyyyMMdd");
                var nombreArchivo = $"ReporteCierre_{fechaStr}.xlsx";

                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = nombreArchivo
                };
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al generar el archivo Excel.");
                throw;
            }
        }

        public FileContentResult GenerarExcelReporteCierreCentral(List<CierreCajaReporteDTO> reportes)
        {
            try
            {
                using var workbook = new XLWorkbook();

                /************ Hoja Resumen ************/
                var resumenSheet = workbook.Worksheets.Add("Resumen");

                resumenSheet.Cell(2, 1).Value = "Resumen Cierre de Caja Central";
                resumenSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                resumenSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16

                //resumenSheet.Cell(3, 1).Value = "Sucursal";
                //resumenSheet.Cell(3, 2).Value = reporte.Movimientos![0].Sucursal;
                resumenSheet.Cell(3, 1).Value = "Fecha";
                resumenSheet.Cell(3, 2).Value = reportes[0].Resumen!.FechaHora;
                resumenSheet.Range("A3:B3").Style.Font.Italic = true; // en italicas
                resumenSheet.Cell(3, 2).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";

                // Fila inicial donde empezará el listado
                int startRow = 5;
                // Columna inicial (1 = A, 2 = B, etc.)
                int startColumn = 1;


                var resumenData = new Dictionary<string, Func<dynamic, object>>
                                {
                                    { "Sucursal", r => r.Sucursal },
                                    { "Monto Efectivo", r => Math.Round(r.MontoEfectivo, 2) },
                                    { "Monto Tarjeta", r => Math.Round(r.MontoTarjetaCredito, 2) },
                                    { "Monto Debito", r => Math.Round(r.MontoDebito, 2) },
                                    { "Monto Transferencia", r => Math.Round(r.MontoTransferencia, 2) },
                                    { "Monto Dólar", r => Math.Round(r.MontoDolar, 2) },
                                    { "Total Efectivo", r => Math.Round(r.TotalEfectivo, 2) },
                                    { "Total Cuenta Clinichm", r => Math.Round(r.TotalCuentaClinichm, 2) },
                                    { "Total Retiro", r => Math.Round(r.TotalRetiro, 2) },
                                    { "Total Vuelto", r => Math.Round(r.TotalVuelto, 2) },
                                    { "Total Sin Cargo", r => Math.Round(r.TotalSinCargo, 2) },
                                    { "Total Voucher", r => Math.Round(r.TotalVoucher, 2) },
                                    { "Cant Voucher", r => r.CantVoucher },
                                };

                // Escribir los nombres de los campos en la columna A (columna 1)
                int currentRow = startRow;
                foreach (var campo in resumenData)
                {

                    var formulaSuma = "SUM(C" + currentRow + ":Z" + currentRow + ")";
                    resumenSheet.Cell(currentRow, 1).Value = campo.Key; // Escribe descripcion.
                    if (campo.Key == "Sucursal")
                    {
                        resumenSheet.Cell(currentRow, 2).Value = "Total";
                    }
                    else
                    {
                        resumenSheet.Cell(currentRow, 2).FormulaA1 = formulaSuma;
                    }
                    currentRow++;
                }


                // Ahora escribimos los valores de cada reporte en columnas adyacentes
                currentRow = startRow;
                int currentColumn = startColumn + 2; // Empezamos en la columna B (2)

                foreach (var reporte in reportes)
                {
                    var resumen = reporte.Resumen; // Obtenemos el objeto resumen del reporte

                    foreach (var campo in resumenData)
                    {
                        var valor = campo.Value(resumen!);

                        if (campo.Key == "Sucursal")
                        {
                            resumenSheet.Cell(currentRow, currentColumn).
                            SetValue(valor.ToString());
                        }
                        else
                        {
                            resumenSheet.Cell(currentRow, currentColumn).
                            SetValue(Convert.ToDecimal(valor));
                        }


                        currentRow++;
                    }
                    currentRow = startRow; // Reiniciamos para el siguiente reporte
                    currentColumn++; // Movemos a la siguiente columna (C, D, etc.)
                }
                ////Estilos de columnas                
                resumenSheet.Column(1).Style.Font.Italic = true; // en italicas
                resumenSheet.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right; // alinea columna a la derecha\]
                resumenSheet.Range("B5:Z16").Style.NumberFormat.Format = "$ #,##0.00"; // Formato de moneda
                resumenSheet.Range("B5:Z5").Style.Font.Bold = true;
                resumenSheet.Range("B5:B17").Style.Fill.BackgroundColor = XLColor.AshGrey;
                resumenSheet.Range("B5:Z5").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                resumenSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                /************** Hoja Movimientos **************/
                var detalleSheet = workbook.Worksheets.Add("Movimientos");

                //Headers
                detalleSheet.Cell(2, 1).Value = "Detalles de Movimientos";
                detalleSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                detalleSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los movimientos
                detalleSheet.Cell(4, 1).Value = "Fecha";
                detalleSheet.Cell(4, 2).Value = "Sucursal";
                detalleSheet.Cell(4, 3).Value = "Medico";
                detalleSheet.Cell(4, 4).Value = "Paciente";
                detalleSheet.Cell(4, 5).Value = "Paciente DNI";
                detalleSheet.Cell(4, 6).Value = "Tipo Movimiento";
                detalleSheet.Cell(4, 7).Value = "Medio de Pago";
                detalleSheet.Cell(4, 8).Value = "Monto";
                detalleSheet.Cell(4, 9).Value = "Número de Factura";
                detalleSheet.Cell(4, 10).Value = "Fecha Hora Transferencia";
                detalleSheet.Cell(4, 11).Value = "Empleado";
                detalleSheet.Cell(4, 12).Value = "Descripción Retiro";
                detalleSheet.Cell(4, 13).Value = "Notas";


                int currentRowDetalle = 5;
                // Iterar sobre cada reporte en la lista `reportes`
                foreach (var reporte in reportes)
                {
                    foreach (var movimiento in reporte.Movimientos!)
                    {
                        var d = movimiento;
                        detalleSheet.Cell(currentRowDetalle, 1).Value = d.FechaHora;
                        detalleSheet.Cell(currentRowDetalle, 2).Value = d.Sucursal;
                        detalleSheet.Cell(currentRowDetalle, 3).Value = d.Medico;
                        detalleSheet.Cell(currentRowDetalle, 4).Value = d.Paciente;
                        detalleSheet.Cell(currentRowDetalle, 5).Value = d.PacienteDNI;
                        detalleSheet.Cell(currentRowDetalle, 6).Value = d.TipoMovimiento;
                        detalleSheet.Cell(currentRowDetalle, 7).Value = d.MedioPago;
                        detalleSheet.Cell(currentRowDetalle, 8).Value = d.Monto;
                        detalleSheet.Cell(currentRowDetalle, 9).Value = d.NumeroFactura?.ToUpper();
                        detalleSheet.Cell(currentRowDetalle, 10).Value = d.FechaHoraTransf;
                        detalleSheet.Cell(currentRowDetalle, 11).Value = d.Empleado;
                        detalleSheet.Cell(currentRowDetalle, 12).Value = d.DescripcionRetiro;
                        detalleSheet.Cell(currentRowDetalle, 13).Value = d.Notas;

                        currentRowDetalle++;
                    }
                }
                //Estilos de columnas
                // Encabezados en negrita
                var detalleHeader = detalleSheet.Range("A4:N4");
                detalleHeader.Style.Font.Bold = true;
                detalleSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                detalleSheet.Column(9).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                detalleSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                detalleSheet.Range("A4:M4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatos = detalleSheet.Range("A4:N1000");
                rangoDatos.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                /************** Hoja Comisiones **************/
                var comisionesSheet = workbook.Worksheets.Add("Comisiones");

                //Headers
                comisionesSheet.Cell(2, 1).Value = "Detalles de Comisiones";
                comisionesSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                comisionesSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los comisiones
                comisionesSheet.Cell(4, 1).Value = "Fecha";
                comisionesSheet.Cell(4, 2).Value = "Sucursal";
                comisionesSheet.Cell(4, 3).Value = "Medico";
                comisionesSheet.Cell(4, 4).Value = "Medio de Pago";
                comisionesSheet.Cell(4, 5).Value = "Monto";

                int currentRowComision = 5;
                // Iterar sobre cada reporte en la lista `reportes`
                foreach (var reporte in reportes)
                {

                    foreach (var comision in reporte.Comisiones!)
                    {
                        var d = comision;
                        comisionesSheet.Cell(currentRowComision, 1).Value = d.FechaDePago;
                        comisionesSheet.Cell(currentRowComision, 2).Value = reporte.Resumen?.Sucursal;
                        comisionesSheet.Cell(currentRowComision, 3).Value = d.Medico;
                        comisionesSheet.Cell(currentRowComision, 4).Value = d.MetodoDePago;
                        comisionesSheet.Cell(currentRowComision, 5).Value = d.Monto;
                        currentRowComision++;

                    }
                }
                //Estilos de columnas
                // Encabezados en negrita
                var comisionesHeader = comisionesSheet.Range("A4:N4");
                comisionesHeader.Style.Font.Bold = true;
                comisionesSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                comisionesSheet.Column(4).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                comisionesSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                comisionesSheet.Range("A4:E4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatosComision = comisionesSheet.Range("A4:N1000");
                rangoDatosComision.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                /************** Hoja Productos **************/
                var productosSheet = workbook.Worksheets.Add("Productos");

                //Headers
                productosSheet.Cell(2, 1).Value = "Detalles de Productos";
                productosSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                productosSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los productos
                productosSheet.Cell(4, 1).Value = "Fecha";
                productosSheet.Cell(4, 2).Value = "Sucursal";
                productosSheet.Cell(4, 3).Value = "Medico";
                productosSheet.Cell(4, 4).Value = "Producto";
                productosSheet.Cell(4, 5).Value = "Cantidad";

                int currentRowProd = 5;

                foreach (var reporte in reportes)
                {

                    foreach (var prod in reporte.Productos!)
                    {
                        var d = prod;
                        productosSheet.Cell(currentRowProd, 1).Value = d.Fecha;
                        productosSheet.Cell(currentRowProd, 2).Value = reporte.Resumen?.Sucursal;
                        productosSheet.Cell(currentRowProd, 3).Value = d.Medico;
                        productosSheet.Cell(currentRowProd, 4).Value = d.Producto;
                        productosSheet.Cell(currentRowProd, 5).Value = d.CantProd;
                        currentRowProd++;
                    }
                }
                //Estilos de columnas
                // Encabezados en negrita
                var productoHeader = productosSheet.Range("A4:N4");
                productoHeader.Style.Font.Bold = true;
                productosSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                productosSheet.Column(5).Style.NumberFormat.Format = "#,##0.00"; // Monto 
                productosSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                productosSheet.Range("A4:E4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatosProd = productosSheet.Range("A4:N1000");
                rangoDatosProd.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;


                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Seek(0, SeekOrigin.Begin);

                var fechaStr = reportes[0].Resumen!.FechaHora.ToString("yyyyMMdd");
                var nombreArchivo = $"ReporteCierreCentral_{fechaStr}.xlsx";

                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = nombreArchivo
                };
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al generar el archivo Excel.");
                throw;
            }
        }

        public FileContentResult GenerarExcelReporteStock(IEnumerable<StockResponseDTO> stock)
        {
            try
            {
                /**** Extraccion de datos *****/
                var productos = _context.Producto
                                .ToDictionary(p => p.Id, p => p.Nombre);

                // Depositos disponibles
                var depositos = _context.Stock
                                .Select(s =>  s.Deposito)
                                .Distinct()
                                .ToList();
               
                // Agrupar por ProductoId y sumar cantidades
                var resumenPorProducto = stock
                    .GroupBy(s => s.ProductoId)
                    .Select(g => new
                    {
                        ProductoId = g.Key,
                        TotalCantidad = g.Sum(x => x.CantidadExistente)
                    })
                    .ToList();

                //Creacion de libro Excel                
                using var workbook = new XLWorkbook();

                /************ Hoja Resumen ************/
                var resumenSheet = workbook.Worksheets.Add("Resumen");

                resumenSheet.Cell(2, 1).Value = "Resumen General de Stock";
                resumenSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                resumenSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16

                resumenSheet.Cell(3, 1).Value = "Fecha";
                resumenSheet.Cell(3, 3).Value = DateTime.Now.ToString("dd-MM-yyyy");
                resumenSheet.Range("A3:D3").Style.Font.Italic = true; // en italicas
                resumenSheet.Cell(3, 3).Style.DateFormat.Format = "dd-mm-yyyy";

                //Productos
                resumenSheet.Cell(5, 1).Value = "Producto";
                resumenSheet.Cell(5, 3).Value = "Cantidad Total";


                int currentRowProd = 6;         

                foreach (var item in resumenPorProducto)
                {
                    var nombreProducto = productos.ContainsKey(item.ProductoId) 
                                            ? productos[item.ProductoId] 
                                            : "Desconocido";

                    resumenSheet.Cell(currentRowProd, 1).Value = nombreProducto;
                    resumenSheet.Cell(currentRowProd, 3).Value = item.TotalCantidad;

                    currentRowProd++;
                }
                var detalleHeader = resumenSheet.Range("A5:D5");
                detalleHeader.Style.Font.Bold = true;
                resumenSheet.Range("A6:A1000").Style.Font.Italic = true; // en italicas
                resumenSheet.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; 
                resumenSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                resumenSheet.Range("A5").SetAutoFilter();

                /************ Hoja Totales Por Deposito ************/

                foreach( var dep in depositos)
                {
                    var depositoSheet = workbook.Worksheets.Add(dep!);

                    depositoSheet.Range("A2:H2").Merge();
                    depositoSheet.Cell(2, 1).Value = $"Resumen de Stock - Deposito: {dep}";
                    depositoSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                    depositoSheet.Cell(2, 1).Style.Font.FontSize = 16;
                    depositoSheet.Cell(2, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left; // tamaño de fuente 16

                    depositoSheet.Cell(3, 1).Value = "Fecha";
                    depositoSheet.Cell(3, 3).Value = DateTime.Now.ToString("dd-MM-yyyy");
                    depositoSheet.Range("A3:B3").Style.Font.Italic = true; // en italicas
                    depositoSheet.Cell(3, 3).Style.DateFormat.Format = "dd-mm-yyyy";

                    //Headers
                    depositoSheet.Cell(5, 1).Value = "Producto";
                    depositoSheet.Cell(5, 3).Value = "Cantidad Existente";

                    int currentRow = 6;

                    foreach (var item in stock.Where(s => s.Deposito == dep)
                                                .GroupBy(s => s.ProductoId)
                                                .Select(g => new
                                                {
                                                    ProductoId = g.Key,
                                                    TotalCantidad = g.Sum(x => x.CantidadExistente)
                                                })
                                                .ToList())
                    {
                        var nombreProducto = productos.ContainsKey(item.ProductoId) 
                                                ? productos[item.ProductoId] 
                                                : "Desconocido";

                        depositoSheet.Cell(currentRow, 1).Value = nombreProducto;
                        depositoSheet.Cell(currentRow, 3).Value = item.TotalCantidad;

                        currentRow++;
                    }

                    var detalleHeaderDepo = depositoSheet.Range("A5:C5");
                    detalleHeaderDepo.Style.Font.Bold = true;
                    depositoSheet.Range("A6:A1000").Style.Font.Italic = true; // en italicas
                    depositoSheet.Column(3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; 
                    depositoSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                    // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                    depositoSheet.Range("A5").SetAutoFilter();
                }

                /**** Lstado de productos ordenado por vto ******/

                var detalleSheet = workbook.Worksheets.Add("Detalle");

                // Combinar celdas de A2 a H2
                detalleSheet.Range("A2:H2").Merge();
                detalleSheet.Cell(2, 1).Value = "Detalle de Stock ordenado por Vencimiento";
                detalleSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                detalleSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16
                detalleSheet.Cell(2, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                detalleSheet.Cell(3, 1).Value = "Fecha";
                detalleSheet.Cell(3, 2).Value = DateTime.Now.ToString("dd-MM-yyyy");
                detalleSheet.Range("A3:B3").Style.Font.Italic = true; // en italicas
                detalleSheet.Cell(3, 2).Style.DateFormat.Format = "dd-mm-yyyy";
                
                //Headers
                detalleSheet.Cell(5, 1).Value = "Producto";
                detalleSheet.Cell(5, 2).Value = "Lote";
                detalleSheet.Cell(5, 3).Value = "Fecha Vencimiento";
                detalleSheet.Cell(5, 4).Value = "Cantidad Ingreso";
                detalleSheet.Cell(5, 5).Value = "Cantidad Existente";
                detalleSheet.Cell(5, 6).Value = "Deposito";
                detalleSheet.Cell(5, 7).Value = "Fecha Ingreso";
                detalleSheet.Cell(5, 8).Value = "Tipo Operacion";

                int currentRowDetails = 6;

                 foreach (var item in stock.OrderBy(s => s.Vencimiento))
                    {
                        var nombreProducto = productos.ContainsKey(item.ProductoId) 
                                                ? productos[item.ProductoId] 
                                                : "Desconocido";

                        detalleSheet.Cell(currentRowDetails, 1).Value = nombreProducto;
                        detalleSheet.Cell(currentRowDetails, 2).Value = item.Lote;
                        detalleSheet.Cell(currentRowDetails, 3).Value = item.Vencimiento.ToString("dd-MM-yyyy");
                        detalleSheet.Cell(currentRowDetails, 4).Value = item.CantidadIngreso;
                        detalleSheet.Cell(currentRowDetails, 5).Value = item.CantidadExistente;
                        detalleSheet.Cell(currentRowDetails, 6).Value = item.Deposito;
                        detalleSheet.Cell(currentRowDetails, 7).Value = item.FechaIngreso.ToString("dd-MM-yyyy");
                        detalleSheet.Cell(currentRowDetails, 8).Value = item.TipoOperacion;
                        currentRowDetails++;
                    }
                var detalleHeaderDetails = detalleSheet.Range("A5:H5");
                    detalleHeaderDetails.Style.Font.Bold = true;
                    detalleSheet.Range("A6:A1000").Style.Font.Italic = true; // en italicas
                    detalleSheet.Range("A5:H5000").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center; 
                    detalleSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                    // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                    detalleSheet.Range("A5:H5").SetAutoFilter();


                //Exportacion del excel
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Seek(0, SeekOrigin.Begin);

                var fechaStr = DateTime.Now.ToString("yyyyMMdd");
                var nombreArchivo = $"ReporteStock_{fechaStr}.xlsx";

                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = nombreArchivo
                };
                
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al generar el archivo Excel.");
                throw;
            }
        }

        public FileContentResult GenerarExcelMovientosYcomisiones(MovimientosYComisionesDTO movYcom)
        { 
            try{
                //Creacion de libro Excel                
                using var workbook = new XLWorkbook();

                /************** Hoja Movimientos **************/
                var detalleSheet = workbook.Worksheets.Add("Movimientos");

                //Headers
                detalleSheet.Cell(2, 1).Value = "Detalles de Ultimos Movimientos";
                detalleSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                detalleSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los movimientos
                detalleSheet.Cell(4, 1).Value = "Fecha";
                detalleSheet.Cell(4, 2).Value = "Sucursal";
                detalleSheet.Cell(4, 3).Value = "Medico";
                detalleSheet.Cell(4, 4).Value = "Paciente";
                detalleSheet.Cell(4, 5).Value = "Paciente DNI";
                detalleSheet.Cell(4, 6).Value = "Tratamientos";
                detalleSheet.Cell(4, 7).Value = "Tipo Movimiento";
                detalleSheet.Cell(4, 8).Value = "Medio de Pago";
                detalleSheet.Cell(4, 9).Value = "Monto";
                detalleSheet.Cell(4, 10).Value = "Número de Factura";
                detalleSheet.Cell(4, 11).Value = "Fecha Hora Transferencia";
                detalleSheet.Cell(4, 12).Value = "Empleado";
                detalleSheet.Cell(4, 13).Value = "Descripción Retiro";


                int currentRowDetalle = 5;
                
                foreach (var movimiento in movYcom.Movimientos!)
                {
                    var d = movimiento;
                    detalleSheet.Cell(currentRowDetalle, 1).Value = d.FechaHora;
                    detalleSheet.Cell(currentRowDetalle, 2).Value = d.Sucursal;
                    detalleSheet.Cell(currentRowDetalle, 3).Value = d.Medico;
                    detalleSheet.Cell(currentRowDetalle, 4).Value = d.Paciente;
                    detalleSheet.Cell(currentRowDetalle, 5).Value = d.PacienteDNI;
                    detalleSheet.Cell(currentRowDetalle, 6).Value = d.Tratamientos;
                    detalleSheet.Cell(currentRowDetalle, 7).Value = d.TipoMovimiento;
                    detalleSheet.Cell(currentRowDetalle, 8).Value = d.MedioPago;
                    detalleSheet.Cell(currentRowDetalle, 9).Value = d.Monto;
                    detalleSheet.Cell(currentRowDetalle, 10).Value = d.NumeroFactura?.ToUpper();
                    detalleSheet.Cell(currentRowDetalle, 11).Value = d.FechaHoraTransf;
                    detalleSheet.Cell(currentRowDetalle, 12).Value = d.Empleado;
                    detalleSheet.Cell(currentRowDetalle, 13).Value = d.DescripcionRetiro;

                    currentRowDetalle++;
                }

                //Estilos de columnas
                // Encabezados en negrita
                var detalleHeader = detalleSheet.Range("A4:N4");
                detalleHeader.Style.Font.Bold = true;
                detalleSheet.Column(1).Style.DateFormat.Format = "dd-mm-yyyy HH:mm";
                detalleSheet.Column(9).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                detalleSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                detalleSheet.Range("A4:M4").SetAutoFilter();

                //centra contenido de detalle
                var rangoDatos = detalleSheet.Range("A4:N1000");
                rangoDatos.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                /************** Hoja Comisiones **************/
                var comisionSheet = workbook.Worksheets.Add("Comisiones");

                //Headers
                comisionSheet.Cell(2, 1).Value = "Detalles de Comisiones";
                comisionSheet.Cell(2, 1).Style.Font.Bold = true; // en negrita
                comisionSheet.Cell(2, 1).Style.Font.FontSize = 16; // tamaño de fuente 16


                //Detalles de los movimientos
                comisionSheet.Cell(4, 1).Value = "Sucursal";
                comisionSheet.Cell(4, 2).Value = "Medico";
                comisionSheet.Cell(4, 3).Value = "Paciente";
                comisionSheet.Cell(4, 4).Value = "Paciente DNI";
                comisionSheet.Cell(4, 5).Value = "Tratamiento";
                comisionSheet.Cell(4, 6).Value = "Comision";

                int currentRowCom = 5;
                
                foreach (var comision in movYcom.Comisiones!)
                {
                    var d = comision;
                    comisionSheet.Cell(currentRowCom, 1).Value = d.Sucursal;
                    comisionSheet.Cell(currentRowCom, 2).Value = d.Medico;
                    comisionSheet.Cell(currentRowCom, 3).Value = d.Paciente;
                    comisionSheet.Cell(currentRowCom, 4).Value = d.PacienteDNI;
                    comisionSheet.Cell(currentRowCom, 5).Value = d.Tratamientos;
                    comisionSheet.Cell(currentRowCom, 6).Value = d.MontoComision;

                    currentRowCom++;
                }

                //Estilos de columnas
                // Encabezados en negrita
                var comHeader = comisionSheet.Range("A4:N4");
                comHeader.Style.Font.Bold = true;
                comisionSheet.Column(6).Style.NumberFormat.Format = "$ #,##0.00"; // Monto 
                comisionSheet.Columns().AdjustToContents(); // Ajusta el ancho de las columnas automáticamente

                // Aplicar AutoFilter a los encabezados (permite filtrar en Excel)
                comisionSheet.Range("A4:F4").SetAutoFilter();

                //centra contenido de detalle
                var rangoComDatos = comisionSheet.Range("A4:N1000");
                rangoComDatos.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;


                //Exportacion del excel
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Seek(0, SeekOrigin.Begin);

                var fechaStr = DateTime.Now.ToString("yyyyMMdd");
                var nombreArchivo = $"MovimientosYComisiones_{fechaStr}.xlsx";

                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = nombreArchivo
                };
                
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error al generar el archivo Excel.");
                throw;
            }


        }

        /* Metodos de manejo interno del service */

        // Obtiene el tipo de modelo desde el ensamblado.
        private Type? ObtenerModelo(string modelo)
        {
            return Assembly.GetExecutingAssembly()
                .GetTypes()
                .FirstOrDefault(t => t.Name.Equals(modelo, StringComparison.OrdinalIgnoreCase));
        }

        // Convierte tipo de datos de excel a tipo de datos
        private object? ConvertirValor(Type tipo, object valorCelda)
        {
            if (valorCelda == null || string.IsNullOrWhiteSpace(valorCelda.ToString()))
            {
                if (tipo.IsValueType) // Si es un tipo de valor (int, decimal, bool), devuelve su valor por defecto
                    return Activator.CreateInstance(tipo);
                return null;
            }

            try
            {
                if (tipo == typeof(int) || tipo == typeof(int?))
                    return int.TryParse(valorCelda.ToString(), out int intValue) ? intValue : (tipo == typeof(int) ? 0 : null);

                if (tipo == typeof(decimal) || tipo == typeof(decimal?))
                    return decimal.TryParse(valorCelda.ToString(), out decimal decValue) ? decValue : (tipo == typeof(decimal) ? 0.0m : null);

                if (tipo == typeof(double) || tipo == typeof(double?))
                    return double.TryParse(valorCelda.ToString(), out double dblValue) ? dblValue : (tipo == typeof(double) ? 0.0 : null);

                if (tipo == typeof(bool) || tipo == typeof(bool?))
                    return bool.TryParse(valorCelda.ToString(), out bool boolValue) ? boolValue : (tipo == typeof(bool) ? false : null);

                if (tipo == typeof(DateTime) || tipo == typeof(DateTime?))
                    return DateTime.TryParse(valorCelda.ToString(), out DateTime dateValue) ? dateValue : (tipo == typeof(DateTime) ? DateTime.MinValue : null);

                if (tipo == typeof(string))
                    return valorCelda.ToString();

                return Convert.ChangeType(valorCelda, tipo);
            }
            catch
            {
                return tipo.IsValueType ? Activator.CreateInstance(tipo) : null;
            }
        }

        // Crea una lista tipada correctamente
        private IList CargarModeloTipado(Type tipoModelo)
        {
            var tipoLista = typeof(List<>).MakeGenericType(tipoModelo);
            var listaObjetos = Activator.CreateInstance(tipoLista) as IList;

            if (listaObjetos == null)
            {
                Log.Error("Error al crear la lista de objetos.");
                throw new Exception("No se pudo crear la lista de objetos para el modelo " + tipoModelo.Name);
            }

            Log.Information($"Lista de objetos creada para el modelo: {tipoModelo.Name}");
            return listaObjetos;
        }
        
    }
}