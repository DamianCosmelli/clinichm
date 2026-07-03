import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoGuardar from '../../../assets/icon-plus-line.svg';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import BotonConIcono from '../../../components/common/BotonConIcono';
import EditableTableListados from '../../../components/common/EditableTableListados';
import { BotonesEdicion } from '../../../components/common/EditableTableListados';
import { ListaProductos, actualizarProducto } from '../../../services/productosService';
import { Producto } from '../../../models/Producto';
import EliminarRegistro from '../../../components/common/EliminarRegistro';
import Loading from '../../common/Loading';
import { ListaCategoriasProd } from '../../../services/categoriaProdService';

const Productos: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Producto>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtro, setFiltro] = useState({ buscar: '' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await ListaProductos();
        setProductos(data.reverse());
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await ListaCategoriasProd();
       
        const categoriasMap = data.reduce((acc, categoria) => {
          acc[categoria.id] = categoria.nombre;
          return acc;
        }, {} as { [key: number]: string });
        setCategorias(categoriasMap);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSave = async (id: number, updatedRow: Partial<Producto>) => {
    try {
      await actualizarProducto(id, updatedRow);
      setProductos((prev) =>
        prev.map((producto) => (producto.id === id ? { ...producto, ...updatedRow } : producto))
      );
      setEditRowId(null);
      setFormData({});
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  const handleEliminar = (id: number) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductos((prev) => prev.filter((producto) => producto.id !== productoAEliminar));
    setProductoAEliminar(null);
  };

  const headers = ['Nombre', 'Categoria', 'Auto descontable', ''];

  const productosFiltrados = productos
    .filter((producto: Producto) => {
      const filtroBuscar =
        !filtro.buscar || producto.nombre.toLowerCase().includes(filtro.buscar.toLowerCase());
      return filtroBuscar;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(
    productos.filter((producto: Producto) => {
      const filtroBuscar =
        !filtro.buscar || producto.nombre.toLowerCase().includes(filtro.buscar.toLowerCase());
      return filtroBuscar;
    }).length / itemsPerPage
  );

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1));
    setCurrentPage(page);
  };

  const rows = productosFiltrados.map((producto: Producto) => ({
    id: producto.id,
    Nombre: editRowId === producto.id ? (
      <input
        type="text"
        value={formData.nombre ?? producto.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        className="border rounded w-40 px-2 py-1 text-sm"
      />
    ) : (
      <span>{producto.nombre}</span>
    ),
    Categoria: editRowId === producto.id ? (
      <select
        value={formData.categoriaProdId ?? producto.categoriaProdId}
        onChange={(e) => setFormData({ ...formData, categoriaProdId: parseInt(e.target.value, 10) })}
        className="border rounded w-40 px-2 py-1 text-sm"
      >
        {Object.entries(categorias).map(([id, nombre]) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </select>
    ) : (
      categorias[producto.categoriaProdId] || 'Sin categoría'
    ),
    'Auto descontable': editRowId === producto.id ? (
      <input
        type="checkbox"
        checked={!formData.noAutoDescontable} // Invertir lógica: checked representa auto descontable
        onChange={(e) => setFormData({ ...formData, noAutoDescontable: !e.target.checked })}
        className="w-5 h-5"
      />
    ) : (
      producto.noAutoDescontable ? 'No' : 'Sí'
    ),
    "": (
      <BotonesEdicion
        isEditing={editRowId === producto.id}
        onSave={() => handleSave(producto.id, formData)}
        onCancel={() => {
          setEditRowId(null);
          setFormData({});
        }}
        onEdit={() => {
          setEditRowId(producto.id);
          setFormData(producto);
        }}
        onDelete={() => handleEliminar(producto.id)}
      />
    ),
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[calc(100vh-180px)] relative overflow-hidden overflow-y-auto">
      <div className="w-full mt-8">
        <span className="text-subtitulo mb-4">Productos</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nuevo producto"
            iconSrc={iconoGuardar}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/productos/nuevo')}
          />
        </div>
        <div className="dropdown-container mt-8 justify-center">
          <div className="dropdown-caja mt-4">
            <select
              className="dropdown-select"
              value={itemsPerPage}
              onChange={(e) => {
                setCurrentPage(1);
                setItemsPerPage(parseInt(e.target.value, 10));
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
            <span className="ml-2 font-bold">/ {totalPages}</span>
          </div>
        </div>
      </div>
      {mostrarModal && productoAEliminar !== null && (
        <EliminarRegistro
          entidad="Producto"
          id={productoAEliminar}
          confirmar={true}
          redireccionar=""
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default Productos;
