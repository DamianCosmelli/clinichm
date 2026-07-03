using DocumentFormat.OpenXml.Drawing;
using Xunit.Sdk;

namespace clinichm_api.Models
{
    public class MovimientoCaja
    {
        public int Id { get; set; }
        public int IdMedico { get; set; }
        public int IdPaciente { get; set; }
        public decimal CotizacionDolar { get; set; }
        public string? NumeroFactura { get; set; }
        public int IdMedioPago { get; set; }
        public decimal Monto { get; set; }
        public string TipoMovimiento { get; set; } = null!;
        public DateTime FechaHora { get; set; }
        public string? FechaHoraTransf { get; set; }
        public int IdSucursal { get; set; } // Nueva propiedad

        // Se actualiza valor al generar el cierre de Caja
        public int IdCierreCaja { get; set; }

        //Se agrega IdEmpleado y Campo DescripcionRetiro
        public int? IdEmpleado { get; set; }
        public string? DescripcionRetiro { get; set; } 
        public int MovRelation { get; set; }       
    }
}
