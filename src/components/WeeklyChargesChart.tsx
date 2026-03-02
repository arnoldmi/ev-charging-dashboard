// src/components/WeeklyChargesChart.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { md3ColorTokens } from '../styles/theme';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyChargesChartProps {
  userId: number;
  vehicleId: number;
}

interface WeeklyData {
  weekLabel: string;
  totalKwh: number;
  chargeCount: number;
  totalCost: number;
  weekStart: string;
}

const WeeklyChargesChart: React.FC<WeeklyChargesChartProps> = ({ userId, vehicleId }) => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [weeksToShow, setWeeksToShow] = useState<number>(8);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;


  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/stats/weekly-charges`,
          { params: { userId, vehicleId, weeks: weeksToShow } }
        );
        setWeeklyData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données hebdomadaires:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && vehicleId) {
      fetchWeeklyData();
    }
  }, [userId, vehicleId, weeksToShow]);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'line' | 'bar' | null,
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleWeeksChange = (
    event: React.MouseEvent<HTMLElement>,
    newWeeks: number | null,
  ) => {
    if (newWeeks !== null) {
      setWeeksToShow(newWeeks);
    }
  };

  // Configuration des données pour le graphique
  const chartData = {
    labels: weeklyData.map(w => w.weekLabel),
    datasets: [
      {
        label: 'Énergie rechargée (kWh)',
        data: weeklyData.map(w => w.totalKwh),
        borderColor: md3ColorTokens.primary.main,
        backgroundColor: chartType === 'line' 
          ? md3ColorTokens.primary.main + '20'  // 12% opacity pour le remplissage
          : md3ColorTokens.primary.main + '80', // 50% opacity pour les barres
        borderWidth: 3,
        fill: chartType === 'line',
        tension: 0.4, // Courbe douce pour le graphique linéaire
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: md3ColorTokens.primary.main,
        pointBorderColor: md3ColorTokens.surface.default,
        pointBorderWidth: 2,
        borderRadius: chartType === 'bar' ? 8 : 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: md3ColorTokens.surface.containerHigh,
        titleColor: '#E6E1E5',
        bodyColor: '#E6E1E5',
        borderColor: md3ColorTokens.outline.variant,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const dataIndex = context.dataIndex;
            const week = weeklyData[dataIndex];
            return [
              `Énergie: ${week.totalKwh.toFixed(2)} kWh`,
              `Recharges: ${week.chargeCount}`,
              `Coût: ${week.totalCost.toFixed(2)} €`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: md3ColorTokens.outline.variant,
        },
        ticks: {
          color: '#CAC4D0',
          callback: function (value: any) {
            return value + ' kWh';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#CAC4D0',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Calculer les statistiques
  const totalKwh = weeklyData.reduce((sum, w) => sum + w.totalKwh, 0);
  const avgKwhPerWeek = weeklyData.length > 0 ? totalKwh / weeklyData.length : 0;
  const maxWeek = weeklyData.reduce(
    (max, w) => (w.totalKwh > max.totalKwh ? w : max),
    weeklyData[0] || { weekLabel: '-', totalKwh: 0 }
  );

  return (
    <Card variant="elevated">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Recharges hebdomadaires
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Évolution de votre consommation par semaine
            </Typography>
          </Box>

          {/* Sélecteur de type de graphique */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={weeksToShow}
              exclusive
              onChange={handleWeeksChange}
              size="small"
              sx={{ height: 36 }}
            >
              <ToggleButton value={4}>4 sem.</ToggleButton>
              <ToggleButton value={8}>8 sem.</ToggleButton>
              <ToggleButton value={12}>12 sem.</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              sx={{ height: 36 }}
            >
              <ToggleButton value="line">Ligne</ToggleButton>
              <ToggleButton value="bar">Barres</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Graphique */}
        <Box sx={{ height: 300, mb: 3 }}>
          {chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </Box>

        {/* Statistiques */}
        {weeklyData.length > 0 && (
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Total période
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {totalKwh.toFixed(2)} kWh
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Moyenne / semaine
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {avgKwhPerWeek.toFixed(2)} kWh
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Semaine max
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {maxWeek.totalKwh.toFixed(2)} kWh
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({maxWeek.weekLabel})
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {weeklyData.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Aucune donnée disponible pour cette période
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyChargesChart;