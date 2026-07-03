namespace clinichm_api.DTOs
{
    public class MovimientoCajaDTO
    {
        public int IdMedico { get; set; }
        public int IdPaciente { get; set; }
        public string? NumeroFactura { get; set; }
        public int IdMedioPago { get; set; }
        public decimal Monto { get; set; }
        public string TipoMovimiento { get; set; } = null!;
        public DateTime FechaHora { get; set; }
        public string? FechaHoraTransf { get; set; }
        public int IdSucursal { get; set; } // Nueva propiedad
        public int IdCierreCaja { get; set; } // Nueva propiedad

        //Se agrega IdEmpleado y Campo DescripcionRetiro
        public int? IdEmpleado { get; set; }
        public string? DescripcionRetiro { get; set; }
        public decimal CotizacionDolar { get; set; }
        public int? MovRelation { get; set; }

    }

    public class MovimientoCajaResponseDTO
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
        public int IdCierreCaja { get; set; } // Nueva propiedad

        //Se agrega IdEmpleado y Campo DescripcionRetiro
        public int? IdEmpleado { get; set; }
        public string? DescripcionRetiro { get; set; }
        public int? MovRelation { get; set; }
        public string? Notas { get; set; } // Nueva propiedad para notas
    }

    public class MovimientoCajaResporteDTO
    {
        public int Id { get; set; }
        public DateTime FechaHora { get; set; }
        public string? Sucursal { get; set; } // Nueva propiedad
        public string? Medico { get; set; }
        public string? Paciente { get; set; }
        public string? PacienteDNI { get; set; }
        public string TipoMovimiento { get; set; } = null!;
        public string? MedioPago { get; set; }
        public decimal Monto { get; set; }
        public string? Tratamientos { get; set; }

        public string? NumeroFactura { get; set; }

        public string? FechaHoraTransf { get; set; }

        //Se agrega IdEmpleado y Campo DescripcionRetiro
        public string? Empleado { get; set; }
        public string? DescripcionRetiro { get; set; }

        public string? Notas { get; set; }

    }

    public class ComisionesDTO
    {
        public string? Sucursal { get; set; }
        public string? Medico { get; set; }
        public string? Paciente { get; set; }
        public string? PacienteDNI { get; set; }
        public string? Tratamientos { get; set; } 
        public decimal MontoComision { get; set; }
    }

    public class MovimientosYComisionesDTO
    {
        public List<MovimientoCajaResporteDTO>? Movimientos { get; set; }
        public List<ComisionesDTO>? Comisiones { get; set; }
    }
    

}
