import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormularioNuevoMedico from '../../../components/Medicos/FormularioNuevoMedico';
import { actualizarMedico, ListaMedicos } from '../../../services/medicosService'; // Corregir la importación
import iconoChevronRight from '../../../assets/icon-chevron-right-rounded.svg';
import iconCheck from '../../../assets/icon-check.svg';
import { z } from 'zod';
import { schemaMedico } from '../../../schema/useFormularioNuevoMedico';
import Loading from '../../common/Loading';

type FormularioNuevoMedicoData = z.infer<typeof schemaMedico>;

const EditarMedico: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medico, setMedico] = useState<{
    nombreApellido: string;
    matricula: string;
    rolId: string;
    sucursalID: string;
  } | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const medicos = await ListaMedicos();
        const medicoEncontrado = medicos.find((m) => m.id === Number(id));
        if (medicoEncontrado) {
          setMedico({
            nombreApellido: `${medicoEncontrado.nombre} ${medicoEncontrado.apellido}`,
            matricula: medicoEncontrado.matricula || '',
            rolId: medicoEncontrado.roleId?.toString() || '', // Asegurar que roleId no sea undefined
            sucursalID: medicoEncontrado.sucursalId?.toString() || '', // Asegurar que sucursalId no sea undefined
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del médico:', error);
      }
    };

    fetchMedico();
  }, [id]);

  const handleFormSubmit = async (data: FormularioNuevoMedicoData) => {
    try {
      await actualizarMedico(Number(id), {
        nombre: data.nombreApellido.split(' ')[0] || '',
        apellido: data.nombreApellido.split(' ').slice(1).join(' ') || '',
        matricula: data.matricula,
        roleId: parseInt(data.rolId, 10),
        sucursalId: parseInt(data.sucursalID, 10),
      });
      setMensajeExito('Médico modificado');
      setTimeout(() => {
        setMensajeExito(null);
        navigate(`/perfil-medico/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el médico:', error);
      setMensajeExito('Error al actualizar el médico');
    }
  };

  return (
    <div className="w-full h-screen bg-fondo-contenedor relative overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-1 -mt-2 -ml-4">
        {/* Navegación */}
        <div className="flex items-center gap-1">
          <Link to="/ajustes?tab=Medicos" className="text-navegacion">Médicos</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <Link to={`/perfil-medico/${id}`} className="text-navegacion">Perfil</Link>
          <img src={iconoChevronRight} alt="chevron right" className="w-4 h-4" />
          <span className="text-navegacion">Editar</span>
        </div>
        {/* Subtítulo y mensaje de éxito */}
        <div className="relative flex justify-between items-center">
          <span className="text-subtitulo mb-4 -mt-4">Editar médico</span>
          {mensajeExito && (
            <div className="absolute right-5 translate-x-8 inline-flex items-center gap-2 p-2 rounded-md border border-[#005B4B] bg-[#005B4B1A]">
              <img src={iconCheck} alt="Éxito" className="w-6 h-6" />
              <span className="text-[#005B4B] text-sm font-normal leading-[19.6px] font-poppins">
                Médico modificado
              </span>
            </div>
          )}
        </div>
      </div>

      {medico ? (
        <FormularioNuevoMedico
          setMensajeExito={setMensajeExito}
          initialValues={medico} // Asegurar que el componente acepte esta propiedad
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <div className="text-center mt-10"><Loading /></div>
      )}
    </div>
  );
};

export default EditarMedico;
