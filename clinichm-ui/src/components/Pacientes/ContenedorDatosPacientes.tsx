import React, { useEffect, useState } from 'react';
import TableListados from '../common/TableListados';
import { Paciente } from '../../models/Paciente';
import { RecepcionPacientes } from '../../models/RecepcionPacientes';
import BotonConIcono from '../common/BotonConIcono';
import { useNavigate } from 'react-router-dom';
import '../../styles/pacientes.css';
import EliminarRegistro from '../common/EliminarRegistro';
import { ENTITIES } from '../../models/Entidades';
import iconoEliminar from '../../assets/iconoEliminar.svg';
import iconoEditar from '../../assets/iconoEditar.svg';
import { obtenerRecepcionPorPacienteId } from '../../services/recepcionPacientesService';
import { calcularEdad } from '../../utils/dateUtils';

interface ContenedorDatosPacientesProps {
  paciente: Paciente;
}

const ContenedorDatosPacientes: React.FC<ContenedorDatosPacientesProps> = ({ paciente }) => {
  const [recepciones, setRecepciones] = useState<RecepcionPacientes[]>([]);
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEditar = () => {
    if (paciente?.dni) {
      navigate('/editarPaciente', { state: { dni: paciente.dni } });
    } else {
      console.error('El paciente no tiene un DNI válido.');
    }
  };

  const handleEliminar = () => {
    setMostrarModal(true);
  };

  useEffect(() => {
    const cargarRecepcionesPaciente = async () => {
      try {
        const recepcionesObtenidas = await obtenerRecepcionPorPacienteId(paciente.id!);
        setRecepciones(recepcionesObtenidas);
      } catch (error) {
        console.error('Error al cargar las recepciones del paciente:', error);
      }
    };

    cargarRecepcionesPaciente();
  }, [paciente]);

  return (
    <div className="mt-4 ml-1 w-full h-[calc(100vh-180px)] px-6 py-10 bg-[#FBFBFB] rounded-lg outline-2 outline-[#D69E41] outline-offset-[-2px] flex flex-col justify-start items-start gap-6 overflow-y-auto relative">
      <div className="relative w-full flex justify-between items-center">
        <div className="w-[394px] h-12 flex justify-start items-center gap-2.5">
          <div className="contenedor-nombre">
            {paciente.nombre} {paciente.apellido}
          </div>
        </div>
        <div className="absolute top-0 right-32 z-10">
          <BotonConIcono
            label="Eliminar"
            iconSrc={iconoEliminar}
            className="boton-eliminar"
            onClick={handleEliminar}
          />
        </div>
        <div className="absolute top-0 right-1 z-10">
          <BotonConIcono
            label="Editar"
            iconSrc={iconoEditar}
            className="boton-editar"
            onClick={handleEditar}
          />
        </div>
      </div>
      <div className="w-full flex justify-start items-start gap-6">
        <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
          <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
            Datos personales
          </div>
          <div className="w-full flex justify-start items-start gap-24">
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Edad</div>
              </div>
              <div className="label-valor">{calcularEdad(paciente?.fechaNac)}</div>
            </div>
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Dirección</div>
              </div>
              <div className="label-valor">{paciente?.direccion || 'N/A'}</div>
            </div>
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Código postal</div>
              </div>
              <div className="label-valor">{paciente?.codigoPostal || 'N/A'}</div>
            </div>
          </div>
          <div className="w-full flex justify-start items-start gap-24">
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Email</div>
              </div>
              <div className="label-valor whitespace-nowrap">{paciente?.email || 'N/A'}</div>
            </div>
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Celular</div>
              </div>
              <div className="label-valor">{paciente?.celular || 'N/A'}</div>
            </div>
            <div className="w-[152px] flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-start items-center">
                <div className="label-titulo">Número de DNI</div>
              </div>
              <div className="label-valor">{paciente?.dni || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="w-[267px] h-full px-4 py-19.5 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-4">
          <div className="w-full text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
            Método de captación
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-start items-center">
              <div className="label-titulo">Nos conoció por</div>
            </div>
            <div className="label-valor">{paciente?.medioPublicidad || 'N/A'}</div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-start items-start gap-6 mt-6">
        <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
          <div className="w-full flex justify-between items-center">
            <div className="text-[#111111] text-lg font-poppins font-semibold leading-7 break-words">
              Historial de Tratamientos
            </div>
          </div>
          <div className="w-full h-64 overflow-y-auto"> {/* Asegurar el scroll */}
            {recepciones.length > 0 ? (
              <TableListados
                headers={['Equipo médico o profesional', 'Tratamiento', 'Motivo de recepción', 'Fecha']}
                rows={
                  recepciones.map((recepcion) => ({
                    'Equipo médico o profesional': recepcion.medicoNombre || 'Desconocido',
                    Tratamiento: recepcion.tratamientoNombre || 'Desconocido',
                    'Motivo de recepción': recepcion.motivoConsulta || 'Desconocido',
                    Fecha: new Date(recepcion.horaIngreso).toLocaleDateString(),
                  }))
                }
              />
            ) : (
              <div className="text-center text-gray-500 mt-4">
                El paciente no posee recepciones asignadas
              </div>
            )}
          </div>
        </div>
      </div>
      {mostrarModal && (
        <EliminarRegistro
          entidad={ENTITIES.Pacientes}
          id={paciente!.id!}
          confirmar={true}
          redireccionar='/pacientes'
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default ContenedorDatosPacientes;
