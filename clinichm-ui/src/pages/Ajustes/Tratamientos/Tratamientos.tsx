import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoGuardar from '../../../assets/icon-plus-line.svg';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import EditableTableListados from '../../../components/common/EditableTableListados';
import { BotonesEdicion } from '../../../components/common/EditableTableListados'; // Importar correctamente BotonesEdicion
import { ListaTratamientos, actualizarTratamiento } from '../../../services/tratamientosService';
import { Tratamiento } from '../../../models/Tratamiento';
import EliminarRegistro from '../../../components/common/EliminarRegistro'; // Importar el componente de eliminación
import Loading from '../../common/Loading'; // Asegúrate de importar el componente de Loading

const Tratamientos: React.FC = () => {
  const navigate = useNavigate();
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Tratamiento>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtro, setFiltro] = useState({
    buscar: '', 
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tratamientoAEliminar, setTratamientoAEliminar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const fetchTratamientos = async () => {
      try {
        const data = await ListaTratamientos();
        setTratamientos(data.reverse()); // Invertir el orden del listado
      } catch (error) {
        console.error('Error al cargar los tratamientos:', error);
      } finally {
        setIsLoading(false); // Finalizar el loading
      }
    };

    fetchTratamientos();
  }, []);

  const handleSave = async (id: number, updatedRow: Partial<Tratamiento>) => {
    try {
      await actualizarTratamiento(id, updatedRow);
      setTratamientos((prev) =>
        prev.map((tratamiento) => (tratamiento.id === id ? { ...tratamiento, ...updatedRow } : tratamiento))
      );
      setEditRowId(null);
      setFormData({});
    } catch (error) {
      console.error('Error al actualizar el tratamiento:', error);
    }
  };

  const handleEliminar = (id: number) => {
    setTratamientoAEliminar(id);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTratamientos((prev) => prev.filter((tratamiento) => tratamiento.id !== tratamientoAEliminar)); // Eliminar el registro de la tabla
    setTratamientoAEliminar(null);
  };

  const headers = [
    'Nombre Tratamiento',
    'Precio Efectivo',
    'Precio Otros Medios de Pago',
    'Comisión',
    'Comisión Encargado',
    'Comisión Especial', // Nuevo header agregado
    '',
  ];

  const tratamientosFiltrados = tratamientos
    .filter((tratamiento: Tratamiento) => {
      const filtroBuscar =
        !filtro.buscar ||
        tratamiento.nombreTratamiento.toLowerCase().includes(filtro.buscar.toLowerCase());
      return filtroBuscar; // Eliminar lógica relacionada con 'sede'
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Aplicar paginación

  const totalPages = Math.ceil(
    tratamientos.filter((tratamiento: Tratamiento) => {
      const filtroBuscar =
        !filtro.buscar ||
        tratamiento.nombreTratamiento.toLowerCase().includes(filtro.buscar.toLowerCase());
      return filtroBuscar; // Eliminar lógica relacionada con 'sede'
    }).length / itemsPerPage
  );

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1));
    setCurrentPage(page);
  };

  const rows = tratamientosFiltrados.map((tratamiento: Tratamiento) => ({
    id: tratamiento.id,
    'Nombre Tratamiento': editRowId === tratamiento.id ? (
      <input
        type="text"
        value={formData.nombreTratamiento ?? tratamiento.nombreTratamiento}
        onChange={(e) => setFormData({ ...formData, nombreTratamiento: e.target.value })}
        className="border rounded w-48 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      <span>{tratamiento.nombreTratamiento}</span>
    ),
    'Precio Efectivo': editRowId === tratamiento.id ? (
      <input
        type="number"
        value={formData.precioEfectivo ?? tratamiento.precioEfectivo}
        onChange={(e) => setFormData({ ...formData, precioEfectivo: parseFloat(e.target.value) })}
        className="border rounded w-24 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      `$${tratamiento.precioEfectivo.toFixed(2)}`
    ),
    'Precio Otros Medios de Pago': editRowId === tratamiento.id ? (
      <input
        type="number"
        value={formData.precioOtrosMediosDePago ?? tratamiento.precioOtrosMediosDePago}
        onChange={(e) => setFormData({ ...formData, precioOtrosMediosDePago: parseFloat(e.target.value) })}
        className="border rounded w-24 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      `$${tratamiento.precioOtrosMediosDePago.toFixed(2)}`
    ),
    Comisión: editRowId === tratamiento.id ? (
      <input
        type="number"
        value={formData.comision ?? tratamiento.comision}
        onChange={(e) => setFormData({ ...formData, comision: parseFloat(e.target.value) })}
        className="border rounded w-24 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      `${tratamiento.comision}`
    ),
    'Comisión Encargado': editRowId === tratamiento.id ? (
      <input
        type="number"
        value={formData.comisionEncargado ?? tratamiento.comisionEncargado}
        onChange={(e) => setFormData({ ...formData, comisionEncargado: parseFloat(e.target.value) })}
        className="border rounded w-24 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      `${tratamiento.comisionEncargado}`
    ),
    'Comisión Especial': editRowId === tratamiento.id ? (
      <input
        type="number"
        value={formData.comisionEspecial ?? tratamiento.comisionEspecial}
        onChange={(e) => setFormData({ ...formData, comisionEspecial: parseFloat(e.target.value) })}
        className="border rounded w-24 px-2 py-1 text-sm" // Aumentar ligeramente el ancho del input
      />
    ) : (
      `${tratamiento.comisionEspecial}`
    ),
    "": (
      <BotonesEdicion
        isEditing={editRowId === tratamiento.id}
        onSave={() => handleSave(tratamiento.id, formData)}
        onCancel={() => {
          setEditRowId(null);
          setFormData({});
        }}
        onEdit={() => {
          setEditRowId(tratamiento.id);
          setFormData(tratamiento);
        }}
        onDelete={() => handleEliminar(tratamiento.id)} // Abrir el modal de confirmación
      />
    ),
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto">
      <div className="w-full mt-8">
        <span className="text-subtitulo mb-4">Tratamientos</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nuevo tratamiento"
            iconSrc={iconoGuardar}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/tratamientos/nuevo')} // Actualizar la ruta
          />
        </div>
        <div className="dropdown-container mt-8 justify-center">
          <div className="dropdown-caja mt-4">
            <select
              className="dropdown-select"
              value={itemsPerPage}
              onChange={(e) => {
                setCurrentPage(1); // Establecer la página actual en 1
                setItemsPerPage(parseInt(e.target.value, 10)); // Actualizar el número de registros por página
              }}
            >
              <option value={10}>mostrar 10</option>
              <option value={20}>mostrar 20</option>
              <option value={30}>mostrar 30</option>
            </select>
          </div>
          <div className="dropdown-caja mt-4">
            <div className="relative">
              <input
                type="text"
                className="dropdown-select pr-10"
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
        </div>
        <div className="mt-8 overflow-y-auto max-h-[70vh]">
          <EditableTableListados headers={headers} rows={rows} onSave={handleSave} />
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center mx-2">
            <input
              type="number"
              value={currentPage}
              onChange={handlePageChange}
              className="w-12 text-center border rounded"
            />
            <span className="ml-2 font-bold">/ {totalPages}</span> {/* Número total de páginas en negrita */}
          </div>
        </div>
      </div>
      {mostrarModal && tratamientoAEliminar !== null && (
        <EliminarRegistro
          entidad="Tratamientos" 
          id={tratamientoAEliminar} // Pasar el ID del tratamiento a eliminar
          confirmar={true} // Mostrar confirmación
          redireccionar="" // No redirigir, solo cerrar el modal
          onClose={cerrarModal} 
        />
      )}
    </div>
  );
};

export default Tratamientos;
