import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormularioEmpleado from '../../../components/Empleados/FormularioEmpleado';
import { actualizarEmpleado, ListaEmpleados } from '../../../services/empleadosService';
import iconoChevronRight from '../../../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../../../assets/icon-check.svg';
import Loading from '../../common/Loading';

const EditarEmpleado: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<{
    nombreApellido: string;
    dni: string;
  } | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const empleados = await ListaEmpleados();
        const empleadoEncontrado = empleados.find((e) => Number(e.id) === Number(id));
        if (empleadoEncontrado) {
          setEmpleado({
            nombreApellido: `${empleadoEncontrado.nombre} ${empleadoEncontrado.apellido}`,
            dni: empleadoEncontrado.dni,
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del empleado:', error);
      }
    };

    fetchEmpleado();
  }, [id]);

  const handleFormSubmit = async (data: { nombreApellido: string; dni: string }) => {
    try {
      const [nombre, apellido] = data.nombreApellido.split(' ');
      await actualizarEmpleado(Number(id), { nombre, apellido, dni: data.dni });
      setMensajeExito('Empleado modificado');
      setTimeout(() => {
        setMensajeExito(null);
        navigate(`/perfil-empleado/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      setMensajeExito('Error al actualizar el empleado');
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/ajustes?tab=Empleados" className="text-navegacion">Empleados</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <Link to={`/perfil-empleado/${id}`} className="text-navegacion">Perfil</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Editar empleado</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Empleado modificado
              </span>
            </div>
          )}
        </div>
      </div>

      {empleado ? (
        <FormularioEmpleado
          setMensajeExito={setMensajeExito}
          initialValues={empleado}
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <div className="text-center mt-10"><Loading /></div>
      )}
    </div>
  );
};

export default EditarEmpleado;
