import React, { useState, useEffect } from 'react';
import TableListados from '../../../components/common/TableListados'; // Componente de tabla
import { obtenerPacientesSoloConsulto } from '../../../services/pacientesService'; // Método para obtener pacientes
import { Paciente } from '../../../models/Paciente';
import iconoCopiar from '../../../assets/iconoCopiar.svg';
import iconCheckDorado from '../../../assets/icon-check-dorado.svg';
import iconoBuscar from '../../../assets/iconoBuscar.svg';
import Loading from "../../common/Loading"; // Importar Loading

const SoloConsulto: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [rows, setRows] = useState<{ Documento: string; Paciente: string; Email: string; Contacto: string }[]>([]);
  const [mensajesCopiados, setMensajesCopiados] = useState<{ [key: string]: boolean }>({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState({ buscar: '' });
  const [loading, setLoading] = useState(true); // Estado loading
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        setLoading(true);
        const data = await obtenerPacientesSoloConsulto();
        const datos = data.map((paciente) => ({
          Documento: paciente.dni,
          Paciente: `${paciente.nombre} ${paciente.apellido}`,
          Email: paciente.email || 'N/A',
          Contacto: paciente.celular,
        }));
        setPacientes(data);
        setRows(datos);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPacientes();
  }, []);

  useEffect(() => {
    const filtrarPacientes = () => {
      const filtradas = pacientes.filter((paciente) => {
        const coincideBusqueda = filtro.buscar
          ? paciente.nombre.toLowerCase().includes(filtro.buscar.toLowerCase()) ||
            paciente.apellido.toLowerCase().includes(filtro.buscar.toLowerCase()) ||
            paciente.dni.toLowerCase().includes(filtro.buscar.toLowerCase()) ||
            (paciente.email?.toLowerCase().includes(filtro.buscar.toLowerCase()) || false)
          : true;
        return coincideBusqueda;
      });

      const datosFiltrados = filtradas.map((paciente) => ({
        Documento: paciente.dni,
        Paciente: `${paciente.nombre} ${paciente.apellido}`,
        Email: paciente.email || 'N/A',
        Contacto: paciente.celular,
      }));

      setRows(datosFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)); // Aplicar paginación
    };

    filtrarPacientes();
  }, [filtro, pacientes, itemsPerPage, currentPage]);

  const copiarAlPortapapeles = (texto: string, contacto: string) => {
    navigator.clipboard.writeText(texto).then(() => {
      setMensajesCopiados((prev) => ({ ...prev, [contacto]: true }));
      setTimeout(() => {
        setMensajesCopiados((prev) => ({ ...prev, [contacto]: false }));
      }, 2000);
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <span className="text-subtitulo mb-4 font-poppins">Solo consulto</span> {/* Título agregado */}
      {/* Filtros */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {/* Mostrar */}
        <div className="flex items-center w-60 h-10 px-3 border border-gray-400 rounded bg-gray-100">
          <select
            className="w-full text-sm font-poppins bg-transparent focus:outline-none"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          >
            <option value={10}>Mostrar 10</option>
            <option value={20}>Mostrar 20</option>
            <option value={30}>Mostrar 30</option>
          </select>
        </div>
        {/* Buscador general */}
        <div className="flex items-center w-70 h-10 px-3 border border-gray-400 rounded bg-gray-100 relative">
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
      {/* Tabla de pacientes */}
      <div className="mt-6">
        <div className={`overflow-y-auto ${rows.length > itemsPerPage ? 'max-h-[420px]' : ''}`}>
          <TableListados
            headers={['Documento', 'Paciente', 'Email', 'Contacto']}
            rows={rows.map((row) => ({
              ...row,
              Documento: (
                <div className="flex justify-center items-center">
                  {row.Documento}
                </div>
              ),
              Paciente: (
                <div className="flex justify-center items-center">
                  {row.Paciente}
                </div>
              ),
              Email: (
                <div className="flex justify-center items-center">
                  {row.Email}
                </div>
              ),
              Contacto: (
                <div className="flex justify-center items-center gap-2">
                  {mensajesCopiados[row.Contacto] ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={iconCheckDorado}
                        alt="Check"
                        className="w-4 h-4"
                      />
                      <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                        Número copiado
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={iconoCopiar}
                        alt="Copiar"
                        className="cursor-pointer w-4 h-4"
                        onClick={() => copiarAlPortapapeles(row.Contacto, row.Contacto)}
                      />
                      <div className="flex flex-col justify-center text-[#85673B] text-[14px] font-poppins font-semibold leading-[19.6px] break-words">
                        {row.Contacto}
                      </div>
                    </>
                  )}
                </div>
              ),
            }))}
          />
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center mx-2">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1));
                setCurrentPage(page);
              }}
              className="w-12 text-center border rounded"
            />
            <span className="ml-2 font-bold">/ {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloConsulto;
