import React, { useState, useEffect } from 'react';
import '../styles/caja.css';

import BotonConIcono from '../components/common/BotonConIcono';
import { obtenerPacientes } from '../services/pacientesService';
import iconoPlus from '../assets/icon-plus-line.svg';
import iconoBuscar from '../assets/iconoBuscar.svg';
import iconoAcciones from '../assets/iconoAcciones.svg'; // Importar el nuevo ícono
import TableListados from '../components/common/TableListados';
import { useNavigate } from 'react-router-dom';
import { calcularEdad } from '../utils/dateUtils'; // Importar desde utils/dateUtils
import Loading from './common/Loading'; // Importar el componente de carga

const TABLE_HEAD = ["DNI", "Paciente", "Celular", "Edad", " "]; // Agregar "Ver perfil" al encabezado

interface PacienteRow {
  [key: string]: string | number | null | React.ReactNode;
  DNI: string;
  Paciente: string;
  Celular: string;
  Edad: number | string;
}

const Pacientes: React.FC = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [rows, setRows] = useState<PacienteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const pacientes = await obtenerPacientes();
        if (pacientes && Array.isArray(pacientes)) {
          const pacientesFormateados = pacientes.map((paciente) => ({
            DNI: paciente.dni || 'N/A',
            Paciente: `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim(),
            Celular: paciente.celular || 'N/A',
            Edad: calcularEdad(paciente.fechaNac), // Usar la misma función de cálculo
          })).reverse();
          setRows(pacientesFormateados);
        } else {
          console.error('El servicio no devolvió una lista válida de pacientes.');
        }
      } catch (error) {
        console.error('Error al cargar los pacientes:', error);
      } finally {
        setIsLoading(false); // Finalizar el loading
      }
    };

    cargarPacientes();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const filtrarPacientes = () => {
    const filtrados = rows.filter((row) =>
      row.Paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
      row.DNI.includes(busqueda)
    );

    return filtrados;
  };

  const handleRowClick = (dni: string) => {
    navigate('/perfilPaciente', { state: { dni } }); // Pasar el DNI en el estado
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex items-center gap-1 px-4 py-1 -mt-2 -ml-4">
        <span className="text-subtitulo">Pacientes</span>
      </div>
      <BotonConIcono
        label="Nuevo paciente"
        onClick={() => navigate('/nuevoPaciente')}
        iconSrc={iconoPlus}
        className="absolute top-0 right-0 -mt-2 mr-1"
      />
      <div className="mt-15">
        {/* Buscador */}
        <div
          className="mt-12 ml-1 w-[99%] h-[30px] pt-[10px] pb-[10px] pl-[15px] pr-[10px] bg-[#FBFBFB] rounded-[4px] outline outline-1 outline-[#5E5D5D] flex justify-start items-center gap-[13px]"
        >
          <input
            type="text"
            placeholder="Buscar paciente por DNI o nombre"
            className="flex-1 text-[#5E5D5D] text-[15px] font-poppins font-normal leading-[20px] break-words bg-transparent border-none focus:outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="w-[22px] h-[22px] relative overflow-hidden cursor-pointer">
            <img
              src={iconoBuscar}
              alt="Buscar"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        {/* Fin Buscador */}
      </div>
      <div className="w-full h-[400px] overflow-y-auto mt-10">
        
        <TableListados
          headers={TABLE_HEAD}
          rows={filtrarPacientes().map((row) => ({
            ...row,
            " ": (
              <div className="flex justify-center items-center">
                <img
                  src={iconoAcciones}
                  alt="Ver perfil"
                  title='Ver perfil' // Tooltip para el ícono de acciones
                  className="cursor-pointer"
                  onClick={() => handleRowClick(row.DNI as string)}
                />
              </div>
            ),
          }))}
        />
      
    </div>
    </div>
  );
};

export default Pacientes;
