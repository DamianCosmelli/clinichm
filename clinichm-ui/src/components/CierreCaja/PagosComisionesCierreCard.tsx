import TableListados from '../common/TableListados';
import { Comision, Movimiento } from '../../models/CierreCajaInfo';
import iconoCambiarPago from '../../assets/cambiarPago.svg';
import { cambiarMetodoPagoComision } from '../../services/cierreCajaService';

interface Props {
  pagosComisiones: Comision[];
  movimientosPago?: Movimiento[];
}

const handlerCambiarMetodoPago = (idComision: number) => {
  cambiarMetodoPagoComision(idComision);
  window.location.reload();
}

const PagosComisionesCierreCard: React.FC<Props> = ({ pagosComisiones, movimientosPago }) => {
  const rows = [
    ...pagosComisiones.map((comision) => ({
      'Nombre y Apellido': comision.medico ?? '',
      'Monto': `$ ${comision.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      'Modo de Pago': (
        <div className="flex items-center justify-center gap-2 font-poppins text-[14px] text-gray-600">
          {comision.metodoDePago} 
          <img
            src={iconoCambiarPago}
            alt="cambiar_metodo_pago"
            title={comision.metodoDePago == 'Efectivo Peso' ? 'Cambiar a Transferencia' : 'Cambiar a Efectivo Peso'}
            className="cursor-pointer w-5 h-5"
            onClick={() => handlerCambiarMetodoPago(comision.id)}
          />
        </div>
      ),
      'Fecha': comision.fechaDePago ? new Date(comision.fechaDePago).toLocaleDateString('es-ES') : '',
    })),
    ...(movimientosPago || []).map((mov) => ({
      'Nombre y Apellido': mov.medico ?? '',
      'Monto': `-$ ${mov.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      'Modo de Pago': mov.medioPago ?? '',
      'Fecha': mov.fechaHora ? new Date(mov.fechaHora).toLocaleDateString('es-ES') : '',
    })),
  ];

  return (
    <div className="w-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Comisiones por médicos
      </div>
      <TableListados
        headers={['Nombre y Apellido', 'Monto', 'Modo de Pago', 'Fecha']}
        rows={rows}
        showTooltip={false}
      />
    </div>
  );
};

export default PagosComisionesCierreCard;
