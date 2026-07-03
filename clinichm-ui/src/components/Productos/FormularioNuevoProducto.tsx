import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonConIcono from '../common/BotonConIcono';
import iconoGuardar from '../../assets/icon-plus-line.svg';
import { ListaCategoriasProd } from '../../services/categoriaProdService';
import { crearProducto } from '../../services/productosService';
import { useFormularioNuevoProducto } from '../../schema/useFormularioNuevoProducto';

const FormularioNuevoProducto: React.FC<{ setMensajeExito: (mensaje: string | null) => void }> = ({ setMensajeExito }) => {
  const { register, handleSubmit, formState: { errors } } = useFormularioNuevoProducto();
  const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await ListaCategoriasProd();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const onSubmit = async (data: { nombre: string; categoriaProdId: number; noAutoDescontable?: string }) => {
    try {
      const producto = {
        ...data,
        noAutoDescontable: data.noAutoDescontable === "true", // Convertir explícitamente a booleano
      };
      await crearProducto(producto);
      setMensajeExito('Producto creado');
      setTimeout(() => {
        setMensajeExito(null);
        navigate('/ajustes?tab=Productos');
      }, 2000);
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    //<div className="w-full px-6 py-24 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] mt-12 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} 
      className="w-full h-[calc(100vh-150px)] px-6 py-8 bg-fondo-card rounded-[12px] border-2 border-[var(--Brand-D69E41,#D69E41)] flex flex-col gap-8 box-border overflow-auto mb-8 mt-11 items-center justify-center relative">
        <div className="grid grid-cols-2 gap-40">
          {/* Columna 1 */}
          <div className="flex flex-col gap-6 ">
            <div>
              <label className="label-general">
                Nombre producto <span className="label-asterisco">*</span>
              </label>
              <input
                {...register('nombre')}
                type="text"
                placeholder="Nombre producto"
                className="input-style"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^a-zA-ZñÑ0-9\s]/g, ""); // Permitir letras, números y espacios
                }}
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="label-general">Categoría</label>
              <select
                {...register('categoriaProdId', { valueAsNumber: true })} // Guardar como número
                className="input-style"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaProdId && <p className="text-red-500 text-sm">{errors.categoriaProdId.message}</p>}
            </div>
          </div>
          {/* Columna 2 */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="label-general">Auto descontable</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 mt-4 ml-3">
                    <span>Sí</span>
                  <input
                    {...register('noAutoDescontable')} 
                    type="radio"
                    value="false" // Guardar como FALSE si es auto descontable
                    className="label-general w-5 h-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  
                </label>
                <label className="flex items-center gap-2 mt-4">
                    <span>No</span>
                  <input
                    {...register('noAutoDescontable')} 
                    type="radio"
                    value="true" // Guardar como TRUE si no es auto descontable
                    className="label-general w-5 h-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  
                </label>
              </div>   
                 <div className="flex items-center gap-2 mt-18 ml-3">
                    <BotonConIcono
                      label="Crear Producto"
                      type="submit"
                      iconSrc={iconoGuardar}
                      className="bg-[#D69E41] text-white hover:bg-opacity-90"
                    />
                </div>      
            </div>
          </div>
        </div>

      </form>
    //</div>
  );
};

export default FormularioNuevoProducto;
