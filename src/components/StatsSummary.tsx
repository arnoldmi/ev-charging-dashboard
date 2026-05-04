// src/components/StatsSummary.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { StatCard } from './MD3Components';

interface StatsSummaryProps {
  avgConsumption: number;
  avgCostPerKwh: number;
  avgCostPerKm: number;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  avgConsumption = 0,
  avgCostPerKwh = 0,
  avgCostPerKm = 0,
}) => {
  // Conversion explicite en nombres pour éviter les erreurs
  const safeAvgConsumption = Number(avgConsumption) || 0;
  const safeAvgCostPerKwh = Number(avgCostPerKwh) || 0;
  const safeAvgCostPerKm = Number(avgCostPerKm) || 0;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
        Moyennes
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<BatteryIcon />}
            title="Consommation moyenne"
            value={safeAvgConsumption.toFixed(2)}
            unit="kWh/100km"
            color="#FFB74D"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<EuroIcon />}
            title="Coût moyen par kWh"
            value={safeAvgCostPerKwh.toFixed(3)}
            unit="€/kWh"
            color="#CF6679"
            variant="elevated"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<TrendingDownIcon />}
            title="Coût moyen par km"
            value={safeAvgCostPerKm.toFixed(3)}
            unit="€/km"
            color="#81C784"
            variant="elevated"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsSummary;