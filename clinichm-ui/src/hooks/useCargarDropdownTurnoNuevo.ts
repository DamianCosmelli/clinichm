import { useState, useEffect } from 'react';
import { ListaTratamientos } from '../services/tratamientosService';
import { ListaMedicos } from '../services/medicosService';
import { ListaSucursales } from '../services/sucursalesService';
import { ListaUsuarios } from '../services/usuariosService'; // Cambiar el nombre a ListaUsuarios
import { ListaEstadosTurno } from '../services/estadoTurnosService';


export const useCargarDropdownTurnoNuevo = () => {
  const [opcionesTratamiento, setOpcionesTratamiento] = useState<{ id: number; nombreTratamiento: string }[]>([]);
  const [opcionesUsuarios, setOpcionesUsuarios] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesMedicos, setOpcionesMedicos] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesSucursales, setOpcionesSucursales] = useState<{ id: number; nombre: string }[]>([]);
  const [opcionesestados, setEstados] = useState<{ id: number; estado: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const tratamientos = await ListaTratamientos();
        setOpcionesTratamiento(tratamientos);

        const usuarios = await ListaUsuarios(); // Usar el tipo definido
        const usuariosFormateados = usuarios.map((usuario) => ({
          id: usuario.id,
          nombre: `${usuario.nombre} ${usuario.apellido}`.trim(), // trim() evita espacios extras
        }));
        setOpcionesUsuarios(usuariosFormateados);

        const medicos = await ListaMedicos();
        const medicosConNombre = medicos.map((medico) => ({
          id: medico.id,
          nombre: `${medico.nombre} ${medico.apellido}`,
        }));
        setOpcionesMedicos(medicosConNombre);

        const sucursales = await ListaSucursales();
        setOpcionesSucursales(sucursales);

        const estados = await ListaEstadosTurno();
        setEstados(estados);

      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    cargarDatos();
  }, []);

  return { opcionesTratamiento, opcionesUsuarios, opcionesMedicos, opcionesSucursales, opcionesestados };
};
