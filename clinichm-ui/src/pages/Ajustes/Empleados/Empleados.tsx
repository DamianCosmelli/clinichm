import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import iconoAcciones from '../../../assets/iconoAcciones.svg';
import TableListados from '../../../components/common/TableListados';
import iconoPlus from '../../../assets/icon-plus-line.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import { ListaEmpleados } from '../../../services/empleadosService';
import { Empleado } from '../../../models/Empleado';
import Loading from '../../common/Loading'; // Asegúrate de importar el componente de Loading

const Empleados: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [filtro, setFiltro] = useState<string>(''); // Estado para el filtro de búsqueda
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await ListaEmpleados();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al cargar los empleados:', error);
      } finally {
        setIsLoading(false); // Finalizar el loading
      }
    };

    fetchEmpleados();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Filtrar empleados según el texto de búsqueda
  const empleadosFiltrados = empleados.filter((empleado) =>
    `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const headers = ['Nombre y Apellido', 'DNI', ''];
  const rows = empleadosFiltrados.map((empleado: Empleado) => ({
    'Nombre y Apellido': `${empleado.nombre} ${empleado.apellido}`,
    DNI: empleado.dni,
    "": (
      <img
        src={iconoAcciones}
        alt="Acciones"
        title='Ver perfil' 
        className="cursor-pointer w-5 h-5"
        onClick={() => navigate(`/perfil-empleado/${empleado.id}`)}
      />
    ),
  }));

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="w-full mt-8">
        <span className="text-subtitulo mb-4">Empleados</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nuevo empleado"
            iconSrc={iconoPlus}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/crear-empleado')}
          />
        </div>
        <div className="dropdown-container mt-8 justify-center">
          <div className="dropdown-caja mt-4">
            <div className="relative">
              <input
                type="text"
                className="dropdown-select pr-10"
                placeholder="Buscar empleado"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <img
                src={iconoBuscar}
                alt="Buscar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 overflow-auto max-h-[40vh]">
          <TableListados headers={headers} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default Empleados;
