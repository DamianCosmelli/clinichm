import React from 'react';
import TableListados from '../common/TableListados';

interface HistorialSesionesProps {
  auditorias: { ip: string; navegador: string; ultimoAcceso: string; estado: string }[];
}

const HistorialSesiones: React.FC<HistorialSesionesProps> = ({ auditorias }) => {
  return (
    <div className="w-full h-full p-4 rounded-lg border-2 border-gray-300 flex flex-col justify-start items-start gap-4 font-poppins mt-6">
      <div className="w-full text-[#111111] text-lg font-semibold leading-7">Historial de sesiones</div>
      <div className="w-full h-full overflow-auto">
        <TableListados
          headers={['Ip', 'Navegador', 'Ultimo acceso', 'Estado']}
          rows={auditorias.map((audit) => ({
            Ip: audit.ip.toLocaleLowerCase().replace('::ffff:', ''), // Eliminar prefijo IPv6 si existe
            Navegador: audit.navegador.split(')')[2], // Extraer solo el nombre del navegador
            'Ultimo acceso': audit.ultimoAcceso,
            Estado: audit.estado,
          }))}
        />
      </div>
    </div>
  );
};

export default HistorialSesiones;
