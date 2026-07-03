import { useEffect, useState } from 'react';
import { ListaSucursales } from '../services/sucursalesService';
import { fetchMediosDePago } from '../services/mediosDePagoService';
import { ListaMedicos } from '../services/medicosService';
import { ListaTratamientos } from '../services/tratamientosService';
import { ListaProductos } from '../services/productosService';
import { Tratamiento } from '../models/Tratamiento';

interface DatosCobro {
  sucursales: { id: number; nombre: string }[];
  mediosDePago: { id: number; medioPago: string }[];
  medicos: { id: number; nombre: string }[];
  tratamientos: Tratamiento[];
  productos: { id: number; nombre: string }[];
  error: string | null;
}

const useCargarDatosCobro = () => {
  const [datos, setDatos] = useState<DatosCobro>({
    sucursales: [],
    mediosDePago: [],
    medicos: [],
    tratamientos: [],
    productos: [],
    error: null,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [sucursalesData, mediosDePagoData, medicosData, tratamientosData, productosData] = await Promise.all([
          ListaSucursales(),
          fetchMediosDePago(),
          ListaMedicos(),
          ListaTratamientos(),
          ListaProductos(),
        ]);

        const medicosConNombre = medicosData.map((medico) => ({
          id: medico.id,
          nombre: `${medico.nombre} ${medico.apellido}`,
        })).filter(medico => medico.id !== 1); // Filtrar el médico con id 1 - Equipo  medico

        setDatos({
          sucursales: sucursalesData,
          mediosDePago: mediosDePagoData,
          medicos: medicosConNombre,
          tratamientos: tratamientosData as Tratamiento[],
          productos: productosData,
          error: null,
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setDatos((prev) => ({ ...prev, error: 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.' }));
      }
    };

    cargarDatos();
  }, []);

  return datos;
};

export default useCargarDatosCobro;
