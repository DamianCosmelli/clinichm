import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconoBuscar from '../../assets/iconoBuscar.svg';
import iconoPlus from '../../assets/icon-plus-line.svg';
import BotonConIcono from '../../components/common/BotonConIcono';
import useCargarDatosMedicos from '../../hooks/useCargarDatosMedicos';
import EditableTableListados, { BotonesEdicion } from '../../components/common/EditableTableListados';
import { ListaStock, actualizarStock } from '../../services/stockService';
import { ListaProductos } from '../../services/productosService';
import { Stock as StockModel } from '../../models/Stock';
import { Producto } from '../../models/Producto';
import EliminarRegistro from '../../components/common/EliminarRegistro'; // Importa el modal de eliminación
import StockTransferCard from '../../components/Stock/StockTransferCard';

const Stock: React.FC = () => {
  const navigate = useNavigate();
  const { sucursales } = useCargarDatosMedicos();
  const [filtro, setFiltro] = useState({ sede: '', buscar: '' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlySinStock, setShowOnlySinStock] = useState(false);

  // Estados para datos
  const [stock, setStock] = useState<StockModel[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<StockModel>>({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [stockAEliminar, setStockAEliminar] = useState<number | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [stockTransferId, setStockTransferId] = useState<number | null>(null);

  // Cargar datos de stock y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockData, productosData] = await Promise.all([ListaStock(), ListaProductos()]);
        setStock(stockData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar datos de stock/productos', error);
      }
    };
    fetchData();
  }, []);

  // Obtener nombre del producto por productoId
  const getNombreProducto = (productoId: number) =>
    productos.find((p) => p.id === productoId)?.nombre || 'N/A';

  // Filtrado
  const stockFiltrado = stock
    .filter((item) => !filtro.sede || item.deposito === filtro.sede)
    .filter((item) => {
      const nombreProducto = getNombreProducto(item.productoId).toLowerCase();
      const lote = (item.lote || '').toLowerCase();
      const buscar = filtro.buscar.toLowerCase();
      return (
        !filtro.buscar ||
        nombreProducto.includes(buscar) ||
        lote.includes(buscar)
      );
    })
    .filter((item) => showOnlySinStock ? item.cantidadExistente === 0 : item.cantidadExistente > 0);

  const totalPages = Math.ceil(stockFiltrado.length / itemsPerPage);

  const pagedStock = stockFiltrado.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1));
    setCurrentPage(page);
  };

  // Guardar cambios: sumar cantidadIngreso a cantidadExistente si se edita cantidadIngreso
  const handleSave = async (id: number, updatedRow: Partial<StockModel>) => {
    try {
      // Buscar el item original
      const original = stock.find((item) => item.id === id);
      const rowToUpdate = { ...updatedRow };

      // Si se está editando cantidadIngreso, sumarla a cantidadExistente
      if (
        updatedRow.cantidadIngreso !== undefined &&
        original &&
        updatedRow.cantidadIngreso !== original.cantidadIngreso
      ) {
        const diff = Number(updatedRow.cantidadIngreso) - Number(original.cantidadIngreso);
        rowToUpdate.cantidadExistente =
          Number(original.cantidadExistente) + diff;
      }

    
      if (updatedRow.tipoOperacion !== undefined) {
        rowToUpdate.tipoOperacion = updatedRow.tipoOperacion;
      } else if (original) {
        rowToUpdate.tipoOperacion = original.tipoOperacion || "Ingreso";
      }

      await actualizarStock(id, rowToUpdate); // Actualizar en la base de datos
      setStock((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...rowToUpdate } : item
        )
      );
      setEditRowId(null);
      setFormData({});
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
    }
  };

  // Nuevo handleDelete: abre el modal de confirmación
  const handleDelete = (id: number) => {
    setStockAEliminar(id);
    setMostrarModal(true);
  };

  // Cerrar el modal y eliminar el registro localmente si fue eliminado
  const cerrarModal = () => {
    setMostrarModal(false);
    setStock((prev) => prev.filter((item) => item.id !== stockAEliminar));
    setStockAEliminar(null);
  };

  // Función para saber si el vencimiento es vencido o del mes actual (solo compara año, mes y día)
  const isVencimientoCercano = (fechaVencimiento: string) => {
    if (!fechaVencimiento) return false;

    // Extraer solo la parte de fecha (YYYY-MM-DD)
    const [anioV, mesV, diaV] = fechaVencimiento.split("-").map(Number);

    const hoy = new Date();
    const anioH = hoy.getFullYear();
    const mesH = hoy.getMonth() + 1; // getMonth() es base 0
    const diaH = hoy.getDate();

    // Vencido (fecha anterior a hoy)
    if (
      anioV < anioH ||
      (anioV === anioH && mesV < mesH) ||
      (anioV === anioH && mesV === mesH && diaV < diaH)
    ) {
      return true;
    }

    // Del mes actual (mismo año y mes)
    if (anioV === anioH && mesV === mesH) {
      return true;
    }

    return false;
  };

  // Determinar si hay edición activa
  const isEditing = editRowId !== null;

  // Ajustar headers dinámicamente
  const headers = [
    'Producto',
    'Cantidad Ingreso',
    'Cantidad Existente',
    'Ingreso',
    'Vencimiento',
    'Lote',
    'Deposito',
    // Solo mostrar "Tipo Operación" si no se está editando ninguna fila
    ...(!isEditing ? ['Tipo Operación'] : []),
    '',
  ];

  const rows = pagedStock.map((item) => {
    const baseRow = {
      id: item.id,
      Producto: getNombreProducto(item.productoId) && (
        <span className="font-bold">{getNombreProducto(item.productoId)}</span>
      ),
      'Cantidad Ingreso': editRowId === item.id ? (
        <input
          type="number"
          value={formData.cantidadIngreso ?? item.cantidadIngreso}
          onChange={(e) => setFormData({ ...formData, cantidadIngreso: Number(e.target.value) })}
          className="border rounded w-24 px-2 py-1 text-sm"
        />
      ) : (
        item.cantidadIngreso
      ),
      'Cantidad Existente': editRowId === item.id ? (
        <input
          type="number"
          value={formData.cantidadExistente ?? item.cantidadExistente}
          onChange={(e) => setFormData({ ...formData, cantidadExistente: Number(e.target.value) })}
          className="border rounded w-20 px-2 py-1 text-sm"
        />
      ) : (
        item.cantidadExistente
      ),
      Ingreso: editRowId === item.id ? (
        <input
          type="date"
          value={formData.fechaIngreso ?? item.fechaIngreso}
          onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
          className="border rounded w-32 px-2 py-1 text-sm"
        />
      ) : (
        item.fechaIngreso
      ),
      Vencimiento: editRowId === item.id ? (
        <input
          type="date"
          value={formData.vencimiento ?? item.vencimiento}
          onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
          className="border rounded w-32 px-2 py-1 text-sm"
        />
      ) : (
        <span
          className={
            isVencimientoCercano(item.vencimiento)
              ? "text-red-600 font-bold rounded px-2 py-1 bg-[#e5e5e5]"
              : ""
          }
        >
          {item.vencimiento}
        </span>
      ),
      Lote: editRowId === item.id ? (
        <input
          type="text"
          value={formData.lote ?? item.lote}
          onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
          className="border rounded w-20 px-2 py-1 text-sm"
        />
      ) : (
        item.lote
      ),
      Deposito: editRowId === item.id ? (
        <select
          value={formData.deposito ?? item.deposito}
          onChange={(e) => setFormData({ ...formData, deposito: e.target.value })}
          className="border rounded w-32 px-2 py-1 text-sm"
        >
          <option value="Deposito Principal">Deposito Principal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.nombre}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
      ) : (
        item.deposito
      ),
      "": (
        <BotonesEdicion
          isEditing={editRowId === item.id}
          onSave={() => handleSave(item.id, formData)}
          onCancel={() => {
            setEditRowId(null);
            setFormData({});
          }}
          onEdit={() => {
            setEditRowId(item.id);
            setFormData(item);
          }}
          onDelete={() => handleDelete(item.id)}
          showTransfer={item.cantidadExistente > 0}
          onTransfer={() => handleTransfer(item.id)}
        />
      ),
    };

    // Solo agregar la columna si no se está editando ninguna fila
    if (!isEditing) {
      return {
        ...baseRow,
        'Tipo Operación':
          item.tipoOperacion !== undefined && item.tipoOperacion !== null && item.tipoOperacion !== ""
            ? item.tipoOperacion
            : <span className="text-gray-400 italic">Sin dato</span>,
      };
    }
    return baseRow;
  });

  const handleTransfer = (id: number) => {
    setStockTransferId(id);
    setShowTransfer(true);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className="w-full  mt-8">
        <span className="text-subtitulo mb-4">Stock</span>
        <div className="flex justify-end">
          <BotonConIcono
            label="Nuevo ingreso"
            iconSrc={iconoPlus}
            className="bg-[#D69E41] text-white hover:bg-opacity-90 -mt-10"
            onClick={() => navigate('/stock/nuevo')}
          />
        </div>
        <div className="dropdown-container mt-8 justify-between ">
          <div className="dropdown-caja mt-4">
            <select
              className="dropdown-select"
              value={filtro.sede}
              onChange={(e) => {
                setCurrentPage(1);
                setFiltro({ ...filtro, sede: e.target.value });
              }}
            >
              <option value="">Todos los depositos</option>
              <option value="Deposito Principal">Deposito Principal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.nombre}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
          </div>
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
         
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="sin-stock"
              checked={showOnlySinStock}
              onChange={(e) => setShowOnlySinStock(e.target.checked)}
            />
            <label htmlFor="sin-stock" className="text-base ml-3">
              Ingresos sin stock
            </label>
          </div>
          <div className="dropdown-caja mt-4">
            <div className="relative">
              <input
                type="text"
                className="dropdown-select pr-10"
                placeholder="Buscar por producto o lote"
                value={filtro.buscar}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFiltro({ ...filtro, buscar: e.target.value });
                }}
              />
              <img
                src={iconoBuscar}
                alt="Buscar"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>
         
        </div>
        {/* Tabla editable de productos + paginación dentro del mismo contenedor scrollable */}
        <div className="mt-8 overflow-y-auto max-h-[60vh] flex flex-col">
          <EditableTableListados headers={headers} rows={rows} onSave={handleSave} />
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
        {/* Fin del contenedor scrollable */}
      </div>
      {/* Modal de confirmación de eliminación */}
      {mostrarModal && stockAEliminar !== null && (
        <EliminarRegistro
          entidad="Stock"
          id={stockAEliminar}
          confirmar={true}
          redireccionar=""
          onClose={cerrarModal}
        />
      )}
      {/* Popup de transferencia de stock */}
      {showTransfer && stockTransferId !== null && (
        <StockTransferCard
          stockId={stockTransferId}
          onClose={() => {
            setShowTransfer(false);
            setStockTransferId(null);
          }}
          onTransfer={() => {
            // Refrescar la lista de stock después de transferir
            ListaStock().then(setStock);
          }}
        />
      )}
    </div>
  );
};

export default Stock;


