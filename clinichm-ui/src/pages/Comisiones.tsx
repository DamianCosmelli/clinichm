import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { ROLES } from '../utils/roles';
import TableListados from '../components/common/TableListados';
import { fetchComisiones, pagarComision } from '../services/comisionesService';
import { ListaMedicos } from '../services/medicosService';
import { fetchCierresCaja, ObtenerCierreCajaInfo } from '../services/cierreCajaService';
import { PagoDeComisiones } from '../models/PagoDeComisiones';
import { Medico } from '../models/Medico';
import { Producto } from '../models/CierreCajaInfo';
import { MovimientoCaja } from '../models/MovimientoCaja';
import BotonConIcono from '../components/common/BotonConIcono';

const medioPagoMap: Record<string, number> = {
  'Efectivo Peso': 1,
  Transferencia: 5,
};

const Comisiones: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [comisiones, setComisiones] = useState<PagoDeComisiones[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajeExito, setMensajeExito] = useState(false);

  const medicoMap = new Map(medicos.map((m) => [m.id, `${m.nombre} ${m.apellido}`]));

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [comisionesData, medicosData, cierresData] = await Promise.all([
          fetchComisiones(),
          ListaMedicos(),
          fetchCierresCaja(),
        ]);
        setComisiones(comisionesData);
        setMedicos(medicosData);

        if (cierresData.length > 0) {
          const ultimoCierre = cierresData.reduce((a, b) =>
            new Date(a.fechaHora) > new Date(b.fechaHora) ? a : b
          );
          const cierreInfo = await ObtenerCierreCajaInfo(ultimoCierre.id);
          setProductos(cierreInfo.productos);
        }
      } catch (error) {
        console.error('Error al cargar datos de comisiones:', error);
      }
    };
    cargarDatos();
  }, []);

  const handlePagarComision = async (comision: PagoDeComisiones) => {
    const idMedioPago = medioPagoMap[comision.metodoDePago] || 1;

    const movimiento: MovimientoCaja = {
      idMedico: comision.medicoId,
      idPaciente: 0,
      idTratamiento: 0,
      idProducto: 0,
      cantidadProducto: 0,
      idMedioPago,
      monto: comision.monto,
      tipoMovimiento: 'pago comision',
      fechaHora: new Date().toISOString(),
      idSucursal: user?.role === ROLES.ADMIN ? 0 : (user?.usuarioData?.sucursalID || 0),
      idCierreCaja: comision.cierreDeCajaId,
      cotizacionDolar: 0,
      notas: `Pago de comisión - ${medicoMap.get(comision.medicoId) || 'Médico'}`,
    };

    try {
      await pagarComision(movimiento);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    } catch (error) {
      console.error('Error al pagar comisión:', error);
    }
  };

  const productosHeaders = ['Nombre y Apellido', 'Producto', 'Cantidad', 'Fecha'];

  const productosRows = productos.map((p) => ({
    'Nombre y Apellido': p.medico ?? '',
    Producto: p.producto ?? '',
    Cantidad: p.cantProd ?? '',
    Fecha: p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '',
  }));

  return (
    <div className="w-full h-[calc(110vh-180px)] bg-fondo-contenedor relative overflow-hidden">
      <div className="w-full">
        <span className="text-subtitulo mb-4">Comisiones</span>
      </div>

      <div className="w-full h-full overflow-y-auto mt-4">
        <div className="w-full p-8 bg-[#FDFDFD] rounded-lg border border-[#CDCDCD] flex flex-col justify-start items-start gap-8">
          <div className="w-full flex justify-between items-center">
            <div className="flex-1 text-[#383838] text-lg font-poppins font-semibold leading-7 break-words">
              Comisiones por médicos
            </div>
            {mensajeExito && (
              <div className="inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
                <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                  Pago registrado
                </span>
              </div>
            )}
          </div>

          <div className="w-full overflow-y-auto">
            <TableListados
              headers={['Nombre y Apellido', 'Monto', 'Modo de Pago', 'Fecha', 'Acción']}
              rows={comisiones.map((comision) => ({
                'Nombre y Apellido': medicoMap.get(comision.medicoId) ?? `Médico #${comision.medicoId}`,
                Monto: `$ ${comision.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
                'Modo de Pago': comision.metodoDePago,
                Fecha: comision.fechaDePago
                  ? new Date(comision.fechaDePago).toLocaleDateString('es-ES')
                  : '',
                Acción: (
                  <BotonConIcono
                    label="Pagar"
                    type="button"
                    className="bg-[#D69E41] text-white px-4 py-1 rounded text-sm font-poppins font-semibold hover:bg-opacity-90"
                    onClick={() => handlePagarComision(comision)}
                  />
                ),
              }))}
              showTooltip={false}
            />
          </div>
        </div>

        <div className="w-full p-8 bg-[#FDFDFD] rounded-lg border border-[#CDCDCD] flex flex-col justify-start items-start gap-8 mt-8">
          <div className="text-[#383838] text-lg font-poppins font-semibold leading-7 break-words">
            Productos empleados por médicos
          </div>
          <div className="w-full overflow-y-auto">
            <TableListados
              headers={productosHeaders}
              rows={productosRows}
              showTooltip={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comisiones;
