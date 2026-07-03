import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Paciente } from '../../../models/Paciente';
import { obtenerPacientes } from '../../../services/pacientesService'; // Importa el servicio real
import Loading from '../../common/Loading';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const agruparPorEdad = (pacientes: Paciente[]) => {
  const grupos = [
    { rango: '0-18', cantidad: 0 },
    { rango: '19-30', cantidad: 0 },
    { rango: '31-40', cantidad: 0 },
    { rango: '41-50', cantidad: 0 },
    { rango: '51-60', cantidad: 0 },
    { rango: '61+', cantidad: 0 },
  ];
  const hoy = new Date();
  pacientes.forEach(p => {
    if (!p.fechaNac) return;
    const fechaNac = new Date(p.fechaNac);
    const edad = hoy.getFullYear() - fechaNac.getFullYear() - (hoy < new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate()) ? 1 : 0);
    if (edad <= 18) grupos[0].cantidad++;
    else if (edad <= 30) grupos[1].cantidad++;
    else if (edad <= 40) grupos[2].cantidad++;
    else if (edad <= 50) grupos[3].cantidad++;
    else if (edad <= 60) grupos[4].cantidad++;
    else grupos[5].cantidad++;
  });
  return grupos;
};

const agruparPorMedioPublicidad = (pacientes: Paciente[]) => {
  const conteo: { [medio: string]: number } = {};
  pacientes.forEach(p => {
    const medio = p.medioPublicidad || 'No especificado';
    conteo[medio] = (conteo[medio] || 0) + 1;
  });
  return Object.entries(conteo).map(([name, value]) => ({ name, value }));
};

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57', '#a4de6c', '#d8854f'
];

const EstadisticaEtariaCaptacion: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerPacientes()
      .then(data => setPacientes(data))
      .catch(() => setPacientes([]))
      .finally(() => setLoading(false));
  }, []);

  const dataEdad = agruparPorEdad(pacientes);
  const dataMedio = agruparPorMedioPublicidad(pacientes);

  const barData = {
    labels: dataEdad.map(d => d.rango),
    datasets: [
      {
        label: 'Cantidad',
        data: dataEdad.map(d => d.cantidad),
        backgroundColor: '#8884d8',
      },
    ],
  };

  const pieData = {
    labels: dataMedio.map(d => d.name),
    datasets: [
      {
        data: dataMedio.map(d => d.value),
        backgroundColor: COLORS,
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Título arriba de cada contenedor */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold mb-2 w-full text-left">Distribución por edad</h3>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 h-full flex-1 flex flex-col">
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Edad',
                    font: { size: 16, weight: 'bold' },
                  },
                  grid: { display: false },
                },
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  grid: { display: false },
                },
              },
            }}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold mb-2 w-full text-left">Método de captación</h3>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 h-full flex-1 flex flex-col items-center justify-center">
          <div style={{ width: 220, height: 220 }}>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          {/* Leyenda personalizada debajo, en una sola línea */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-2 w-full">
            {pieData.labels.map((label, idx) => (
              <div key={label} className="flex items-center gap-1">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: COLORS[idx % COLORS.length],
                  }}
                />
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticaEtariaCaptacion;

