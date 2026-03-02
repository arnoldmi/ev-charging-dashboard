// src/components/ChartsSection.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { md3ColorTokens } from '../styles/theme';
import WeeklyChargesChart from './WeeklyChargesChart';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsSectionProps {
  userId: number;
  vehicleId: number;
}

interface MonthlyData {
  currentMonth: number;
  previousMonth: number;
  currentMonthName: string;
  previousMonthName: string;
}

interface LocationData {
  location: string;
  count: number;
  totalKwh: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ userId, vehicleId }) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    currentMonth: 0,
    previousMonth: 0,
    currentMonthName: '',
    previousMonthName: '',
  });
  const [locationData, setLocationData] = useState<LocationData[]>([
    {location: "Paris", count: 0, totalKwh: 0}
  ]);
  const [loading, setLoading] = useState(true);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        // Récupérer les données des recharges mensuelles
        const monthlyResponse = await axiosInstance.get(
          `/api/stats/monthly-charges`,
          { params: { userId, vehicleId } }
        );

        // Récupérer les données par localisation
        const locationResponse = await axiosInstance.get(
          `/api/stats/charges-by-location`,
          { params: { userId, vehicleId } }
        );

        setMonthlyData(monthlyResponse.data);
        setLocationData(locationResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des graphiques:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && vehicleId) {
      fetchChartData();
    }
  }, [userId, vehicleId]);

  // Configuration du graphique en barres (recharges mensuelles)
  const barChartData = {
    labels: [monthlyData.previousMonthName, monthlyData.currentMonthName],
    datasets: [
      {
        label: 'Énergie rechargée (kWh)',
        data: [monthlyData.previousMonth, monthlyData.currentMonth],
        backgroundColor: [
          md3ColorTokens.primary.main + '80', // 50% opacity
          md3ColorTokens.primary.main,
        ],
        borderColor: [md3ColorTokens.primary.main, md3ColorTokens.primary.main],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
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
            return `${context.parsed.y.toFixed(2)} kWh`;
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
        },
      },
    },
  };

  // Configuration du graphique en camembert (localisation)
  const pieChartData = {
    labels: locationData.map((loc) => loc.location),
    datasets: [
      {
        label: 'Nombre de recharges',
        data: locationData.map((loc) => loc.count),
        backgroundColor: [
          md3ColorTokens.primary.main,
          md3ColorTokens.secondary.main,
          md3ColorTokens.tertiary.main,
          '#FFB74D',
          '#81C784',
          '#64B5F6',
          '#CF6679',
          '#B0A7C0',
        ],
        borderColor: md3ColorTokens.surface.default,
        borderWidth: 3,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#CAC4D0',
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
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
        callbacks: {
          label: function (context: any) {
            const location = locationData[context.dataIndex];
            return [
              `${context.label}`,
              `Recharges: ${location.count}`,
              `Total: ${location.totalKwh.toFixed(2)} kWh`,
            ];
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          Analyse des recharges
        </Typography>
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
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Analyse des recharges
      </Typography>

      {/* Graphique hebdomadaire - Pleine largeur */}
      <Box sx={{ mb: 2 }}>
        <WeeklyChargesChart userId={userId} vehicleId={vehicleId} />
      </Box>

      <Grid container spacing={2}>
        {/* Graphique en barres - Recharges mensuelles */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="elevated" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Énergie rechargée par mois
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comparaison entre le mois actuel et le mois précédent
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={barChartData} options={barChartOptions} />
              </Box>
              {/* Statistiques supplémentaires */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      {monthlyData.previousMonthName}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {monthlyData.previousMonth.toFixed(2)} kWh
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      {monthlyData.currentMonthName}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {monthlyData.currentMonth.toFixed(2)} kWh
                    </Typography>
                  </Grid>
                </Grid>
                {monthlyData.currentMonth > 0 && monthlyData.previousMonth > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Évolution
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          monthlyData.currentMonth > monthlyData.previousMonth
                            ? 'error.main'
                            : 'success.main',
                        fontWeight: 500,
                      }}
                    >
                      {monthlyData.currentMonth > monthlyData.previousMonth ? '↑' : '↓'}{' '}
                      {Math.abs(
                        ((monthlyData.currentMonth - monthlyData.previousMonth) /
                          monthlyData.previousMonth) *
                          100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique en camembert - Localisation des recharges */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="elevated" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Recharges par localisation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Répartition de vos points de recharge
              </Typography>
              {locationData.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 300,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Aucune donnée de localisation disponible
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartsSection;