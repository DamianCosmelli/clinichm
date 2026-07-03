import React, { useEffect, useState, useRef } from "react";
import iconoCerrar from "../../assets/iconoCerrar.svg";
import { obtenerStockPorId, transferirStock } from "../../services/stockService";
import { obtenerProductoPorId } from "../../services/productosService";
import useCargarDatosMedicos from "../../hooks/useCargarDatosMedicos";
import { Stock } from "../../models/Stock";
import { Producto } from "../../models/Producto";
import BotonConIcono from "../common/BotonConIcono";
import iconoTransfer from "../../assets/iconoTransfer.svg";
import Loading from "../../pages/common/Loading";

interface StockTransferCardProps {
  stockId: number;
  onClose: () => void;
  onTransfer?: (data: {
    cantidad: number;
    depositoDestino: string;
    fechaEgreso: string;
  }) => void;
}

const StockTransferCard: React.FC<StockTransferCardProps> = ({
  stockId,
  onClose,
  onTransfer,
}) => {
  const { sucursales } = useCargarDatosMedicos();
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState<Stock | null>(null);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [depositoDestino, setDepositoDestino] = useState<string>("");
  const [fechaEgreso] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mensaje, setMensaje] = useState<string>("");
  const [mostrarPopper, setMostrarPopper] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cantidadInvalida =
    cantidad < 1 || (stock && cantidad > stock.cantidadExistente);

  useEffect(() => {
    const fetchStockAndProducto = async () => {
      try {
        const data = await obtenerStockPorId(stockId);
        setStock(data);
        setCantidad(data.cantidadExistente);
        // Obtener el producto por id
        const prod = await obtenerProductoPorId(data.productoId);
        setProducto(prod);
        // Inicializar depósito destino vacío para forzar selección
        setDepositoDestino("");
      } finally {
        setLoading(false);
      }
    };
    fetchStockAndProducto();
  }, [stockId, sucursales]);

  const handleTransfer = async () => {
    if (!stock) return;
    if (!depositoDestino) {
      setMensaje("Debe seleccionar un depósito destino.");
      return;
    }
    if (cantidadInvalida) {
      setMensaje("La cantidad debe ser mayor a 0 y no superar la existente.");
      return;
    }
    try {
      setMensaje("");
     
      const stockParaTransferir =
        !stock.tipoOperacion || stock.tipoOperacion === ""
          ? { ...stock, tipoOperacion: "Transferencia" }
          : stock;

      await transferirStock(
        stockParaTransferir,
        cantidad,
        depositoDestino,
        fechaEgreso
      );
      setMensaje("Stock transferido.");
      setMostrarPopper(true);
      // Notificar al padre para refrescar la lista
      if (onTransfer) {
        onTransfer({
          cantidad,
          depositoDestino,
          fechaEgreso,
        });
      }
      // Cerrar el popper y el modal después de un breve delay
      timeoutRef.current = setTimeout(() => {
        setMostrarPopper(false);
        setMensaje("");
        onClose();
      }, 2000);
    } catch {
      setMensaje("Error al transferir stock.");
      setMostrarPopper(true);
      timeoutRef.current = setTimeout(() => {
        setMostrarPopper(false);
        setMensaje("");
      }, 2000);
    }
  };

  if (loading || !stock) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
        <div className="w-full max-w-md">
          <Loading />
        </div>
      </div>
    );
  }

  // Opciones de depósito destino (excluyendo el depósito actual)
  const depositosDestino = [
    ...(["Deposito Principal", ...sucursales.map((s) => s.nombre)]
      .filter(
        (nombre) =>
          nombre !== stock.deposito &&
          !(stock.deposito === "Deposito Principal" && nombre === "Deposito Principal")
      )
      .map((nombre) => ({ value: nombre, label: nombre }))),
  ];

  return (
    <>
      {/* Popper en la parte inferior -- Stock transferido */}
      {mostrarPopper && mensaje && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            {mensaje}
          </div>
        </div>
      )}
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
        <div className="bg-white rounded-1xl shadow-1xl p-2 border-2 border-gray-100 w-90 flex justify-center items-center">
          <div className="bg-gray-100 max-h-full overflow-y-auto rounded-xl shadow-lg p-8 card-estilo relative w-full border border-gray-200">
            <div className="absolute top-6 right-2 flex gap-2 items-center">
              <img
                src={iconoCerrar}
                alt="Cerrar"
                className="iconSize cursor-pointer"
                onClick={onClose}
              />
            </div>
            <div className="w-full flex flex-col gap-2 mt-8">
              <div className="tipografiaCardsConfirmacion text-center">
                Transferir producto
              </div>
              <div className=" text-start text-lg mt-2">
                {producto ? producto.nombre : stock.productoId}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="tipografiaCardsConfirmacionSmall">Cantidad:</span>
                <input
                  type="number"
                  min={1}
                  max={stock.cantidadExistente}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="border rounded w-24 px-2 py-1 text-sm"
                />
                <span className="text-gray-700 text-xs">
                  (existente: {stock.cantidadExistente})
                </span>
              </div>
              {cantidadInvalida && (
                <div className="text-red-600 text-xs mt-1">
                  La cantidad debe ser mayor a 0 y no superar la existente.
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="tipografiaCardsConfirmacionSmall">
                  Fecha de egreso:
                </span>
                <input
                  type="date"
                  value={fechaEgreso}
                  readOnly
                  className="w-36 px-2 py-1 text-sm bg-transparent outline-none font-bold"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="tipografiaCardsConfirmacionSmall">Vencimiento:</span>
                <span className="tipografiaCardsConfirmacion">
                  {stock.vencimiento}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tipografiaCardsConfirmacionSmall">Lote:</span>
                <span className="tipografiaCardsConfirmacion">{stock.lote}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tipografiaCardsConfirmacionSmall">
                  Depósito actual:
                </span>
                <span className="tipografiaCardsConfirmacion">{stock.deposito}</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="tipografiaCardsConfirmacionSmall text-center">
                  Depósito destino:
                </label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={depositoDestino}
                  onChange={(e) => setDepositoDestino(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione una opción
                  </option>
                  {depositosDestino.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full flex justify-center items-center mt-8 gap-2">
              <BotonConIcono
                label="Transferir"
                iconSrc={iconoTransfer}
                className={`bg-[#005B4B] text-white px-4 py-2 rounded hover:bg-[#00775e] boton-con-icono-rel`}
                type="button"
                onClick={handleTransfer}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockTransferCard;


