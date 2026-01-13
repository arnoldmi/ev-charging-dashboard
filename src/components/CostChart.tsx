import React from 'react';
import { Bar } from 'react-chartjs-2';

interface Charge {
  date: string;
  kwh: number;
  cost: number;
  mileage: number;
  prev_mileage: number | null;
}

interface CostChartProps {
  charges: Charge[];
}

const CostChart: React.FC<CostChartProps> = ({ charges }) => {
  // Calcul du coût par kWh et par km pour chaque recharge
  if (!charges || charges.length <= 1) {
    return <p>Aucune donnée suffisante pour afficher le graphique.</p>;
  }

  // Calcul du coût par kWh et par km pour chaque recharge
  const costPerKwhData = charges.map((charge, index) => {
    if (index === 0 || charge.kwh === 0) return null;
    return charge.cost / charge.kwh;
  }).filter((value) => value !== null);

  const costPerKmData = charges.map((charge, index) => {
    if (index === 0 || !charge.prev_mileage) return null;
    const distance = charge.mileage - charge.prev_mileage;
    return distance > 0 ? (charge.cost / (distance / 100)) : null;
  }).filter((value) => value !== null);

  const labels = charges.map((charge) => charge.date).slice(1);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Coût par kWh (€)',
        data: costPerKwhData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Coût par km (€)',
        data: costPerKmData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Évolution des coûts (€/kWh et €/km)',
              font: { size: 16 },
            },
          },
        }}
      />
    </div>
  );
};

export default CostChart;
