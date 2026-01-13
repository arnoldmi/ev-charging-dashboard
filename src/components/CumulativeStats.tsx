import React from 'react';
import { Card } from './Card';
import { StatBlock } from './StatBlock';
import { FaBolt, FaEuroSign, FaCar, FaPiggyBank, FaCarSide, FaChargingStation } from 'react-icons/fa6';
import { FaMoneyBillWave } from 'react-icons/fa';

interface CumulativeStatsProps {
  totalMileage: number;
  totalKwh: number;
  totalCost: number;
  totalDistance: number;
  totalCharges: number;
}

const CumulativeStats: React.FC<CumulativeStatsProps> = ({
  totalMileage = 0,
  totalKwh = 0,
  totalCost = 0,
  totalDistance = 0,
  totalCharges = 0,
}) => {
  // Conversion explicite en nombres pour éviter les erreurs
  const safeMileage = Number(totalMileage) || 0;
  const safeKwh = Number(totalKwh) || 0;
  const safeCost = Number(totalCost) || 0;
  const safeDistance = Number(totalDistance) || 0;
  const safeCharges = Number(totalCharges) || 0;

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Statistiques cumulatives ...</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '20px' }}>
        <Card title="">
          <StatBlock
            icon={<FaCarSide />}
            label="Kilométrage actuel"
            value={`${safeMileage.toLocaleString()} km`}
            color="#64b5f6"
          />
        </Card>
      </div>
      <div style={{ padding: '20px' }}>
        <Card title="">
          <StatBlock
            icon={<FaCar />}
            label="Kilométrage total (calculé)"
            value={`${safeDistance.toLocaleString()} km`}
            color="#bb86fc"
          />
        </Card>
      </div>
      <div style={{ padding: '20px' }}>
        <Card title="">
          <StatBlock
            icon={<FaBolt />}
            label="Énergie totale consommée"
            value={`${safeKwh.toFixed(2)} kWh`}
            color="#ffb74d"
          />
        </Card>
      </div>
      <div style={{ padding: '20px' }}>
        <Card title="">
          <StatBlock
            icon={<FaMoneyBillWave />}
            label="Coût total"
            value={`${safeCost.toFixed(2)} €`}
            color="#ffa89dda"
          />
        </Card>
      </div>
      <div style={{ padding: '20px' }}>
        <Card title="">
          <StatBlock
            icon={<FaChargingStation />}
            label="Nombre de recharges"
            value={`${safeCharges}`}
            color="#ffb74d"
          />
        </Card>
      </div>
      </div>
    </div>
  );
};

export default CumulativeStats;
