import React, { useState, useEffect } from 'react';
import useCargarDatosMedicos from '../../../hooks/useCargarDatosMedicos';
import { obtenerTurnosAfectados, actualizarTurno, actualizarConResolucion } from '../../../services/turnosService';
import type { Turno } from '../../../models/Turno'; // Usar el modelo actualizado
import TableListados from '../../../components/common/TableListados'; // Componente de tabla
import iconoBuscar from '../../../assets/iconoBuscar.svg'; // Ícono de búsqueda
import iconoCopiar from '../../../assets/iconoCopiar.svg'; // Ícono para copiar
import iconCheckDorado from '../../../assets/icon-check-dorado.svg'; // Ícono de confirmación
import Loading from "../../common/Loading"; // Importar Loading

const TurnosAfectados: React.FC = () => {
  const { sucursales, medicos } = useCargarDatosMedicos(); // Cargar sucursales y médicos
  const [filtro, setFiltro] = useState({ sede: '', medico: '', buscar: '' });
  const [turnosAfectados, setTurnosAfectados] = useState<Turno[]>([]); // Usar el modelo Turno
  const [mensajesCopiados, setMensajesCopiados] = useState<{ [key: string]: boolean }>({}); // Estado para mensajes copiados
  const [loading, setLoading] = useState(true); // Estado loading

  useEffect(() => {
    const cargarTurnosAfectados = async () => {
      try {
        setLoading(true);
        const data = await obtenerTurnosAfectados();
        setTurnosAfectados(data); // Asignar datos correctamente
      } catch (error) {
        console.error('Error al cargar turnos afectados:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarTurnosAfectados();
  }, []);

  const copiarAlPortapapeles = (texto: string, contacto: string) => {
    navigator.clipboard.writeText(texto).then(() => {
      setMensajesCopiados((prev) => ({ ...prev, [contacto]: true }));
      setTimeout(() => {
        setMensajesCopiados((prev) => ({ ...prev, [contacto]: false }));
      }, 2000);
    });
  };

  const turnosFiltrados = turnosAfectados.filter((turno) => {
    const coincideSede = filtro.sede ? turno.sucursalNombre === filtro.sede : true;
    const coincideMedico = filtro.medico ? turno.medicoNombre === filtro.medico : true;
    const coincideBuscar = filtro.buscar
      ? turno.pacienteNombre?.toLowerCase().includes(filtro.buscar.toLowerCase())
      : true;
    return coincideSede && coincideMedico && coincideBuscar;
  });

  const cambiarEstadoTurno = async (id: number, nuevoEstado: 'Cancelado' | 'Reprogramado') => {
    try {
      const turnoActualizado = turnosAfectados.find((turno) => turno.id === id);
      if (!turnoActualizado) return;

      const cambios: Turno = {
        ...turnoActualizado,
        cancelado: nuevoEstado === 'Cancelado',
        reprogramado: nuevoEstado === 'Reprogramado',
      };

      await actualizarTurno(id, cambios);
      await actualizarConResolucion(id);

      // Recargar el listado desde el backend
      setLoading(true);
      const data = await obtenerTurnosAfectados();
      setTurnosAfectados(data);
      setLoading(false);

    } catch (error) {
      console.error('Error al cambiar el estado del turno:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 w-full px-4 font-poppins">
      {/* Filtros */}
      <div className="flex gap-4 items-center justify-center">
        <div className="dropdown-caja w-1/3">
          <select
            className="dropdown-select font-poppins w-full"
            value={filtro.sede}
            onChange={(e) => setFiltro({ ...filtro, sede: e.target.value })}
          >
            <option value="">Seleccione una sede</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.nombre}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-caja w-1/3">
          <select
            className="dropdown-select font-poppins w-full"
            value={filtro.medico}
            onChange={(e) => setFiltro({ ...filtro, medico: e.target.value })}
          >
            <option value="">Seleccione un médico</option>
            {medicos.map((medico) => (
              <option key={medico.id} value={`${medico.nombre} ${medico.apellido}`}>
                {medico.nombre} {medico.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center w-1/3 h-9 px-3 border border-gray-400 rounded bg-gray-100 relative">
          <input
            type="text"
            className="dropdown-select pr-10 w-full"
            placeholder="Buscar"
            value={filtro.buscar}
            onChange={(e) => setFiltro({ ...filtro, buscar: e.target.value })}
          />
          <img
            src={iconoBuscar}
            alt="Buscar"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
      </div>

      {/* Tabla de turnos afectados */}
      <TableListados
        headers={['Fecha', 'Sede', 'Paciente', 'Medico', 'Contacto', 'Estado']}
        rows={turnosFiltrados.map((turno) => ({
          Fecha: turno.fechaHora.split('T')[0], // Mostrar solo la fecha
          Sede: turno.sucursalNombre,
          Paciente: turno.pacienteNombre,
          Medico: turno.medicoNombre,
          Contacto: (
            <div className="flex justify-center items-center gap-2">
              {mensajesCopiados[turno.pacienteCelular!] ? (
                <div className="flex items-center gap-2">
                  <img
                    src={iconCheckDorado}
                    alt="Check"
                    className="w-4 h-4"
                  />
                  <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                    Número copiado
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={iconoCopiar}
                    alt="Copiar"
                    className="cursor-pointer w-4 h-4"
                    onClick={() => copiarAlPortapapeles(turno.pacienteCelular!, turno.pacienteCelular!)}
                  />
                  <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                    {turno.pacienteCelular}
                  </div>
                </>
              )}
            </div>
          ),
          Estado: (
            <select
              className="w-35 h-8 px-2 border border-gray-400 rounded bg-gray-100 text-sm font-poppins text-black"
              value={
                turno.reprogramado
                  ? 'Reprogramado'
                  : turno.cancelado
                  ? 'Cancelado'
                  : ''
              }
              onChange={(e) => cambiarEstadoTurno(turno.id!, e.target.value as 'Cancelado' | 'Reprogramado')}
            >
              <option value="">Sin resolución</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Reprogramado">Reprogramado</option>
            </select>
          ),
        }))}
      />
    </div>
  );
};

export default TurnosAfectados;

