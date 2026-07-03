import { useState, useEffect } from 'react';
import { ListaSucursales } from '../services/sucursalesService';// Cambiar el nombre a ListaUsuarios

export const useCargarDropdownRecepCalendar = () => {

  const [opcionesPiso, setOpcionesPiso] = useState<{ value: string; piso: string }[]>([]);
  const [opcionesSucursales, setOpcionesSucursales] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesEstados, setOpcionesEstados] = useState<{ value: string; estado: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        const pisos: { value: string; piso: string }[] = [
          { value: "Piso 1", piso: "Piso 1" },
          { value: "Piso 2", piso: "Piso 2" }
        ];
        setOpcionesPiso(pisos);

         const estados = [
      { value: "En Espera", estado: "En Espera" },
      { value: "Ingresado", estado: "Ingresado" },
      { value: "Finalizado", estado: "Finalizado" },
      ];
      setOpcionesEstados(estados);

        const sucursales = await ListaSucursales();
        setOpcionesSucursales(sucursales);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    cargarDatos();
  }, []);

  return {opcionesEstados, opcionesPiso, opcionesSucursales };
};
