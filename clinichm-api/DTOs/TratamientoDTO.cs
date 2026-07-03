using System.Text.Json.Serialization;
using clinichm_api.Utils;

namespace clinichm_api.DTOs
{
    public class TratamientoDTO
    {
        public string NombreTratamiento { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public int SucursalId { get; set; }
        public decimal PrecioEfectivo { get; set; }
        public decimal PrecioOtrosMediosDePago { get; set; }
        public decimal Comision { get; set; }
        public decimal ComisionEncargado { get; set; }
        public decimal ComisionEspecial { get; set; }
    }
    public class TratamientoResponseDTO
    {
        public int Id { get; set; }
        public string NombreTratamiento { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public int SucursalId { get; set; }
        public decimal PrecioEfectivo { get; set; }
        public decimal PrecioOtrosMediosDePago { get; set; }
        public decimal Comision { get; set; }
        public decimal ComisionEncargado { get; set; }
        public decimal ComisionEspecial { get; set; }
    }
}
