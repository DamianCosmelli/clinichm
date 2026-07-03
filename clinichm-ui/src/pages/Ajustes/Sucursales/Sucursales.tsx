import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoAcciones from '../../../assets/iconoAcciones.svg';
import TableListados from '../../../components/common/TableListados';
import iconoPlus from '../../../assets/icon-plus-line.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import { ListaSucursales } from '../../../services/sucursalesService';
import { Sucursal } from '../../../models/Sucursal';
import Loading from '../../common/Loading'; // Asegúrate de importar el componente de Loading
const Sucursales: React.FC = () => {
  const navigate = useNavigate();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await ListaSucursales();
        setSucursales(data);
      } catch (error) {
        console.error('Error al cargar las sucursales:', error);
      } finally {
        setIsLoading(false); // Finalizar el loading
      }
    };

    fetchSucursales();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const headers = ['Sucursal', 'Dirección', 'Ciudad', 'Código Postal', ''];
  const rows = sucursales.map((sucursal: Sucursal) => ({
    Sucursal: sucursal.nombre,
    Dirección: sucursal.direccion,
    Ciudad: sucursal.ciudad,
    'Código Postal': sucursal.codigoPostal,
    "": (
      <img
        src={iconoAcciones}
        alt="Acciones"
        title='Ver perfil' // Tooltip para el ícono de acciones
        className="cursor-pointer w-5 h-5"
        onClick={() => navigate(`/perfil-sucursal/${sucursal.id}`)}
      />
    ),
  }));

  return (
    <div className="w-full h-screen  relative overflow-hidden">
      <div className="w-full mt-8">
        <span className="text-subtitulo mb-4">Sedes</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nueva sede"
            iconSrc={iconoPlus}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/crear-sucursal')}
          />
        </div>
        <div className="mt-8 overflow-y-auto max-h-[70vh]">
          <TableListados headers={headers} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default Sucursales;
