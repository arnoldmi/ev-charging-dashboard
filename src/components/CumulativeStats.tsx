// src/components/CumulativeStats.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  DirectionsCar as CarIcon,
  Route as RouteIcon,
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  EvStation as ChargingStationIcon,
} from '@mui/icons-material';
import { StatCard } from './MD3Components';

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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Statistiques cumulatives
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            icon={<CarIcon />}
            title="Kilométrage actuel"
            value={safeMileage.toLocaleString('fr-FR')}
            unit="km"
            color="#64b5f6"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            icon={<RouteIcon />}
            title="Kilométrage total (calculé)"
            value={safeDistance.toLocaleString('fr-FR')}
            unit="km"
            color="#bb86fc"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            icon={<BatteryIcon />}
            title="Énergie totale consommée"
            value={safeKwh.toFixed(2)}
            unit="kWh"
            color="#ffb74d"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            icon={<EuroIcon />}
            title="Coût total"
            value={safeCost.toFixed(2)}
            unit="€"
            color="#ffa89dda"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            icon={<ChargingStationIcon />}
            title="Nombre de recharges"
            value={safeCharges}
            color="#4CAF50"
            variant="elevated"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CumulativeStats;