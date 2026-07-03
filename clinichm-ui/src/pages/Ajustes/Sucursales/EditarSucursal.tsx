import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormularioNuevaSucursal from '../../../components/Sucursales/FormularioNuevaSucursal';
import { actualizarSucursal, ListaSucursales } from '../../../services/sucursalesService';
import iconoChevronRight from '../../../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../../../assets/icon-check.svg';
import Loading from '../../common/Loading';

const EditarSucursal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sucursal, setSucursal] = useState<{
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
  } | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const fetchSucursal = async () => {
      try {
        const sucursales = await ListaSucursales();
        const sucursalEncontrada = sucursales.find((s) => s.id === Number(id));
        if (sucursalEncontrada) {
          setSucursal({
            nombre: sucursalEncontrada.nombre,
            direccion: sucursalEncontrada.direccion,
            ciudad: sucursalEncontrada.ciudad,
            codigoPostal: sucursalEncontrada.codigoPostal,
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos de la sucursal:', error);
      }
    };

    fetchSucursal();
  }, [id]);

  const handleFormSubmit = async (data: { nombre: string; direccion: string; ciudad: string; codigoPostal: string }) => {
    try {
      await actualizarSucursal(Number(id), data);
      setMensajeExito('Sede modificada');
      setTimeout(() => {
        setMensajeExito(null);
        navigate(`/perfil-sucursal/${id}`); // Redirigir al perfil de la sucursal correspondiente
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar la sucursal:', error);
      setMensajeExito('Error al actualizar la sucursal');
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/ajustes?tab=Sedes" className="text-navegacion">Sedes</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <Link to={`/perfil-sucursal/${id}`} className="text-navegacion">Perfil</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Editar sede</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Sede modificada
              </span>
            </div>
          )}
        </div>
      </div>

      {sucursal ? (
        <FormularioNuevaSucursal
          setMensajeExito={setMensajeExito}
          initialValues={sucursal}
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <div className="text-center mt-10"><Loading /></div>
      )}
    </div>
  );
};

export default EditarSucursal;
