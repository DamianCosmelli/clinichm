import React from 'react';
import { Paciente } from '../../models/Paciente';
import BotonConIcono from '../common/BotonConIcono';
import SelectRedSocial from '../common/SelectRedSocial';

interface ContenedorEdicionPacienteProps {
  pacienteEditable: Paciente | null;
  handleInputChange: (field: keyof Paciente, value: string | boolean) => void;
  handleCancelarEdicion: () => void;
}

const ContenedorEdicionPaciente: React.FC<ContenedorEdicionPacienteProps> = ({
  pacienteEditable,
  handleInputChange,
  handleCancelarEdicion,
}) => {
  return (
    <div> 
      <div className="w-full flex justify-between items-center">
        <h2 className="text-3xl font-poppins  text-[#111111] whitespace-nowrap">
          {pacienteEditable?.nombre} {pacienteEditable?.apellido}
        </h2>
        {/*<button
          className="text-red-500 font-semibold"
          onClick={handleCancelarEdicion}
        >
          Cancelar
        </button>*/}
         <div className="w-full flex justify-end">
        <BotonConIcono
          label="Cancelar Editar"
          className='boton-con-icono-rel'
          onClick={handleCancelarEdicion}         
        />
        </div>
      </div>
      <div className="w-full flex justify-start items-start gap-8 mt-8">
        <div className="flex-1 px-4 py-6 bg-[#FBFBFB] rounded-md  outline-2 outline-[#D4D4D4] flex flex-col justify-start items-start gap-6">
          <div className="w-full flex justify-start items-start gap-">
            {/* Columna 1 */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="label-general">Celular</label>
                <input
                  type="text"
                  className="input-style"
                  maxLength={11} // Limitar a 11 caracteres
                  value={pacienteEditable?.celular || ''}
                  onChange={(e) => handleInputChange('celular', e.target.value)}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                  }}
                />
              </div>
              <div>
                <label className="label-general">Email</label>
                <input
                  type="email"
                  className="input-style"
                  value={pacienteEditable?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="label-general">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="input-style"
                  value={pacienteEditable?.fechaNac || ''}
                  onChange={(e) => handleInputChange('fechaNac', e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                />
              </div>
            </div>
            {/* Columna 2 */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="label-general">Dirección</label>
                <input
                  type="text"
                  className="input-style"
                  value={pacienteEditable?.direccion || ''}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                />
              </div>
              <div>
                <label className="label-general">Código Postal</label>
                <input
                  type="text"
                  className="input-style"
                  value={pacienteEditable?.codigoPostal || ''}
                  onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                  maxLength={4} // Limitar a 5 caracteres
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                  }}
                />
              </div>
              <div>
                <label className="label-general">Medio de Publicidad</label>
            <SelectRedSocial 
                  name="medioPublicidad"
                  className="input-style" 
                  value={pacienteEditable?.medioPublicidad || ''}
                  onChange={(e) => handleInputChange('medioPublicidad', e.target.value)}/>
              </div>
              <div className="flex items-center gap-2 mt-1">
                
                <input
                  type="checkbox"
                  className="label-general w-5 h-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  checked={pacienteEditable?.soloConsulto || false}
                  onChange={(e) => handleInputChange('soloConsulto', e.target.checked)}
                />
                <label className="label-checkbox">Solo Consulto</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenedorEdicionPaciente;
