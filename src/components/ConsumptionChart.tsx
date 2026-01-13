import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface Charge {
  date: string;
  kwh: number;
  mileage: number;
  prev_mileage: number | null;
}

interface ConsumptionChartProps {
  charges: Charge[];
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ charges }) => {
  // Calculer la consommation en kWh/100km pour chaque recharge
  const consumptionData = charges.map((charge, index) => {
    if (index === 0 || !charge.prev_mileage) return null; // Pas de données pour la première recharge
    const distance = charge.mileage - charge.prev_mileage; // Distance parcourue depuis la dernière recharge
    return distance > 0 ? (charge.kwh / (distance / 100)) : 0; // Consommation en kWh/100km
  }).filter((value) => value !== null);

  const labels = charges.map((charge) => charge.date).slice(1); // On ignore la première recharge

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Consommation (kWh/100km)',
        data: consumptionData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Consommation de la Volkswagen ID.3 (kWh/100km)',
              font: { size: 16 },
            },
          },
        }}
      />
    </div>
  );
};

export default ConsumptionChart;
