import config from './config';

export const ENDPOINTS = {
    //Rutas de la API
    MEDICOS: new URL('api/Medicos', config.apiBaseUrl).toString(),
    PACIENTES: new URL('api/Pacientes', config.apiBaseUrl).toString(),
    EMPLEADOS: new URL('api/Empleado', config.apiBaseUrl).toString(),
    SUCURSALES: new URL('api/Sucursales', config.apiBaseUrl).toString(),
    TURNOS: new URL('api/Turnos', config.apiBaseUrl).toString(),
    TRATAMIENTOS: new URL('api/Tratamientos', config.apiBaseUrl).toString(),
    USUARIOS: new URL('api/Usuario', config.apiBaseUrl).toString(),
    MOVIMIENTOS_CAJA: new URL('api/MovimientoCaja', config.apiBaseUrl).toString(),
    MEDIOS_DE_PAGO: new URL('api/MedioDePago', config.apiBaseUrl).toString(),
    CIERRES_CAJA: new URL('api/CierreCaja', config.apiBaseUrl).toString(),
    MOVIMIENTO_CAJA: new URL('api/MovimientoCaja', config.apiBaseUrl).toString(),
    PRODUCTOS: new URL('api/Producto', config.apiBaseUrl).toString(),
    ESTADO_TURNOS: new URL('api/EstadosTurnos', config.apiBaseUrl).toString(),
    AGENDA_MEDICA: new URL('api/AgendaMedica', config.apiBaseUrl).toString(),
    IMPORT_DATA: new URL('api/ImportData', config.apiBaseUrl).toString(),
    MEDICO_TRATAMIENTO: new URL('api/MedicoTratamiento', config.apiBaseUrl).toString(),
    PAGO_COMISIONES: new URL('api/PagoDeComisiones', config.apiBaseUrl).toString(),
    RECEPCION_PACIENTES: new URL('api/RecepcionPacientes', config.apiBaseUrl).toString(),
    ROL: new URL('api/Rol', config.apiBaseUrl).toString(),
    ROLE_COMISION: new URL('api/RoleComision', config.apiBaseUrl).toString(),
    USUARIO_AUDIT: new URL('api/UsuarioAudit', config.apiBaseUrl).toString(),
    USUARIO_CONSULTAR_PASS: new URL('api/Usuario/consultarpass', config.apiBaseUrl).toString(),
    STOCK: new URL('api/Stock', config.apiBaseUrl).toString(),
    //Rutas especiales
    PACIENTES_BUSCAR_POR_DNI: new URL('api/Pacientes/buscar-por-dni', config.apiBaseUrl).toString(),
    TURNOS_FECHA: new URL('api/Turnos/rango-fecha', config.apiBaseUrl).toString(),
    AGENDA_FECHA: new URL('api/AgendaMedica/rango-fecha', config.apiBaseUrl).toString(),
    CATEGORIAS_PROD: new URL('api/CategoriaProd', config.apiBaseUrl).toString(),
    PACIENTES_SOLO_CONSULTO: new URL('api/Pacientes/solo-consulto', config.apiBaseUrl).toString(),
    PACIENTES_SIN_VISITA_EN_ULTIMOS_MESES: new URL('api/Pacientes/sin-visita-en-ultimos-meses', config.apiBaseUrl).toString(),
    TURNOS_AFECTADOS: new URL('api/Turnos/turnos-afectados', config.apiBaseUrl).toString(),
    
};
