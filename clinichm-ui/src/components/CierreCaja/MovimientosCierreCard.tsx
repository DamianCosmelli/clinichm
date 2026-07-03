import TableListados from '../common/TableListados';
import { Movimiento } from '../../models/CierreCajaInfo';
import IconoNotas from '../../assets/IconoComentario.svg';
import PopupNotas from '../common/PopupNotas';
import { useState } from 'react';

interface Props {
  movimientosCierre: Movimiento[];
}

const MovimientosCierreCard: React.FC<Props> = ({movimientosCierre }) => {

  const [notasSeleccionadas, setNotasSeleccionadas] = useState<{id: number, notas: string} | null>(null);
  const [verNotas, setVerNotas] = useState<boolean>(false);
  
  
    const handlerNotas = (id: number, nota: string) => {
    if (notasSeleccionadas?.id === id) {
      setNotasSeleccionadas(null);
      setVerNotas(false); // Cerrar si ya está abierto
      } else {
      setNotasSeleccionadas({id, notas: nota});
      setVerNotas(true); 
    }
  }

  return (
    <div className="w-full p-10 bg-[#FBFBFB] rounded-lg border-2 border-[#D4D4D4] flex flex-col justify-start items-start gap-6">
      <div className="text-[#111111] text-lg font-poppins font-semibold leading-7">
        Movimientos
      </div>
      <TableListados
        headers={['Nombre y Apellido','DNI', 'Tipo Movimiento','Medio de Pago','Monto', 'Fecha', ' ']}
        rows={movimientosCierre
          .filter(c => c.tipoMovimiento !='Retiro')
          .map((movimiento) => {
            return {
              'Nombre y Apellido': movimiento.paciente ?? '',
              'DNI' : movimiento.pacienteDNI ?? '',
              'Tipo Movimiento': movimiento.tipoMovimiento ?? '',
              'Medio de Pago':movimiento.medioPago ?? '',
              'Monto' :movimiento.tipoMovimiento == "Cobro" ?  `$ ${movimiento.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` : 
              `-$ ${movimiento.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
              'Fecha': movimiento.fechaHora ? new Date(movimiento.fechaHora).toLocaleDateString('es-ES'):'',
              ' ' : movimiento.notas ? (
                <img
                  src={IconoNotas}
                  alt="Notas"
                  title="Ver Notas"// Tooltip
                  className="cursor-pointer w-5 h-5"
                  onClick={() => handlerNotas(movimiento.id!, movimiento.notas!)} 
                />
              ) : '',
            }
          })}
        showTooltip={false}
      />
      {/* Popup para ver notas */}
      {verNotas && (
        <PopupNotas
          notas={notasSeleccionadas?.notas || ''}
          onClose={() => setVerNotas(false)}
        />
      )}
    </div>
  );
};

export default MovimientosCierreCard;
