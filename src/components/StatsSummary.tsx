import React from 'react';
import { Card } from './Card';
import { StatBlock } from './StatBlock';
import { FaBolt, FaEuroSign, FaCar, FaPiggyBank } from 'react-icons/fa6';

interface StatsSummaryProps {
  avgConsumption: number;
  avgCostPerKwh: number;
  avgCostPerKm: number;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  avgConsumption,
  avgCostPerKwh,
  avgCostPerKm,
}) => {
  console.log("Props reçues :", { avgConsumption, avgCostPerKwh, avgCostPerKm });

  // Convertir explicitement les valeurs en nombres
  const consumption = typeof avgConsumption === 'number' ? avgConsumption : 0;
  const costPerKwh = typeof avgCostPerKwh === 'number' ? avgCostPerKwh : 0;
  const costPerKm = typeof avgCostPerKm === 'number' ? avgCostPerKm : 0;

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Stats consommation ...</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '20px' }}>
            <Card title="">
              <StatBlock
                icon={<FaBolt />}
                label="Consommation moyenne"
                value={`${consumption.toFixed(2)} kWh/100 km`}
                color="#ffb74d"
              />
            </Card>
          </div>
          <div style={{ padding: '20px' }}>
            <Card title="">
              <StatBlock
                icon={<FaEuroSign />}
                label="Coût moyen par kWh"
                value={`${costPerKwh.toFixed(3)} €`}
                color="#4caf50"
              />
            </Card>
          </div>
          <div style={{ padding: '20px' }}>
            <Card title="">
              <StatBlock
                icon={<FaEuroSign />}
                label="Coût moyen par km"
                value={`${costPerKm.toFixed(3)} €`}
                color="#4caf50"
              />
            </Card>
          </div>
        </div>
    </div>
  );
};

export default StatsSummary;
