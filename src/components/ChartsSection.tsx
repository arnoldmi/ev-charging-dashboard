// src/components/ChartsSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Collapse,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { md3ColorTokens } from '../styles/theme';
import WeeklyChargesChart from './WeeklyChargesChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

interface ConsumptionPoint {
  label: string;
  avgConsumption: number;
  avgCostPerKwh: number;
  totalKwh: number;
  chargeCount: number;
}

type PeriodPreset = 'all' | 'year' | '6months' | '3months' | 'custom';
type Granularity = 'week' | 'month';

const formatDateInput = (date: Date): string =>
  date.toISOString().split('T')[0];

const getPresetDates = (preset: PeriodPreset): { start: Date | null; end: Date } => {
  const end = new Date();
  if (preset === 'all') return { start: null, end };
  if (preset === 'year') {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    return { start, end };
  }
  if (preset === '6months') {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return { start, end };
  }
  if (preset === '3months') {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return { start, end };
  }
  return { start: null, end };
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ userId, vehicleId }) => {
  // Période
  const [preset, setPreset] = useState<PeriodPreset>('year');
  const [customStart, setCustomStart] = useState<string>(
    formatDateInput(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  );
  const [customEnd, setCustomEnd] = useState<string>(formatDateInput(new Date()));
  const [granularity, setGranularity] = useState<Granularity>('month');

  // Données
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    currentMonth: 0,
    previousMonth: 0,
    currentMonthName: '',
    previousMonthName: '',
  });
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [consumptionEvolution, setConsumptionEvolution] = useState<ConsumptionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [evolutionLoading, setEvolutionLoading] = useState(true);

  // Calcul des dates effectives selon le preset
  const getEffectiveDates = useCallback((): { startDate?: string; endDate?: string } => {
    if (preset === 'custom') {
      return { startDate: customStart, endDate: customEnd };
    }
    if (preset === 'all') return {};
    const { start, end } = getPresetDates(preset);
    return {
      startDate: start ? formatDateInput(start) : undefined,
      endDate: formatDateInput(end),
    };
  }, [preset, customStart, customEnd]);

  // Fetch graphiques principaux (barres + camembert)
  useEffect(() => {
    const fetchChartData = async () => {
      if (!userId || !vehicleId) return;
      try {
        setLoading(true);
        const params = { userId, vehicleId, ...getEffectiveDates() };

        const [monthlyResponse, locationResponse] = await Promise.all([
          axiosInstance.get('/api/stats/monthly-charges', { params }),
          axiosInstance.get('/api/stats/charges-by-location', { params }),
        ]);

        setMonthlyData(monthlyResponse.data);
        setLocationData(locationResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des graphiques:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [userId, vehicleId, getEffectiveDates]);

  // Fetch évolution de consommation
  useEffect(() => {
    const fetchEvolution = async () => {
      if (!userId || !vehicleId) return;
      try {
        setEvolutionLoading(true);
        const params = { userId, vehicleId, granularity, ...getEffectiveDates() };
        const response = await axiosInstance.get('/api/stats/consumption-evolution', { params });
        setConsumptionEvolution(response.data);
      } catch (error) {
        console.error("Erreur évolution consommation:", error);
      } finally {
        setEvolutionLoading(false);
      }
    };
    fetchEvolution();
  }, [userId, vehicleId, granularity, getEffectiveDates]);

  // Granularité auto selon la période
  useEffect(() => {
    if (preset === '3months') setGranularity('week');
    else setGranularity('month');
  }, [preset]);

  const handlePresetChange = (_: React.MouseEvent<HTMLElement>, value: PeriodPreset | null) => {
    if (value) setPreset(value);
  };

  // ─── Chart configs ───────────────────────────────────────────

  const barChartData = {
    labels: [monthlyData.previousMonthName, monthlyData.currentMonthName],
    datasets: [
      {
        label: 'Énergie rechargée (kWh)',
        data: [monthlyData.previousMonth, monthlyData.currentMonth],
        backgroundColor: [
          md3ColorTokens.primary.main + '80',
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
      legend: { display: false },
      tooltip: {
        backgroundColor: md3ColorTokens.surface.containerHigh,
        titleColor: '#E6E1E5',
        bodyColor: '#E6E1E5',
        borderColor: md3ColorTokens.outline.variant,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y.toFixed(2)} kWh`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: md3ColorTokens.outline.variant },
        ticks: { color: '#CAC4D0', callback: (v: any) => v + ' kWh' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#CAC4D0' },
      },
    },
  };

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
          '#FFB74D', '#81C784', '#64B5F6', '#CF6679', '#B0A7C0',
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
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: md3ColorTokens.surface.containerHigh,
        titleColor: '#E6E1E5',
        bodyColor: '#E6E1E5',
        borderColor: md3ColorTokens.outline.variant,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const loc = locationData[ctx.dataIndex];
            return [`Recharges: ${loc.count}`, `Total: ${loc.totalKwh.toFixed(2)} kWh`];
          },
        },
      },
    },
  };

  const evolutionChartData = {
    labels: consumptionEvolution.map((p) => p.label),
    datasets: [
      {
        label: 'Consommation moy. (kWh/100km)',
        data: consumptionEvolution.map((p) => p.avgConsumption),
        borderColor: md3ColorTokens.primary.main,
        backgroundColor: md3ColorTokens.primary.main + '20',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: md3ColorTokens.primary.main,
        tension: 0.35,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Coût moyen (€/kWh)',
        data: consumptionEvolution.map((p) => p.avgCostPerKwh),
        borderColor: md3ColorTokens.secondary.main,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: md3ColorTokens.secondary.main,
        borderDash: [4, 4],
        tension: 0.35,
        fill: false,
        yAxisID: 'y2',
      },
    ],
  };

  const evolutionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#CAC4D0',
          padding: 16,
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: md3ColorTokens.surface.containerHigh,
        titleColor: '#E6E1E5',
        bodyColor: '#E6E1E5',
        borderColor: md3ColorTokens.outline.variant,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          afterBody: (items: any[]) => {
            const idx = items[0]?.dataIndex;
            if (idx === undefined) return [];
            const pt = consumptionEvolution[idx];
            return [`Recharges: ${pt.chargeCount}`, `Total kWh: ${pt.totalKwh.toFixed(1)}`];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        position: 'left' as const,
        grid: { color: md3ColorTokens.outline.variant },
        ticks: { color: '#CAC4D0', callback: (v: any) => v.toFixed(1) + ' kWh/100' },
      },
      y2: {
        beginAtZero: false,
        position: 'right' as const,
        grid: { display: false },
        ticks: { color: '#CAC4D0', callback: (v: any) => v.toFixed(3) + ' €/kWh' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#CAC4D0', maxRotation: 45 },
      },
    },
  };

  // ─── Render ──────────────────────────────────────────────────

  const periodLabel =
    preset === 'all' ? 'toutes les données' :
    preset === 'year' ? 'les 12 derniers mois' :
    preset === '6months' ? 'les 6 derniers mois' :
    preset === '3months' ? 'les 3 derniers mois' :
    `du ${customStart} au ${customEnd}`;

  return (


    
    <Box sx={{ mb: 4 }}>

      <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
        Analyse des recharges
      </Typography>

      {/* ── Graphique hebdomadaire ── */}
      <Box sx={{ mb: 2 }}>
        <WeeklyChargesChart userId={userId} vehicleId={vehicleId} />
      </Box>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Choix de la période d'analyse
      </Typography>

      {/* ── Sélecteur de période ── */}
      <Card variant="elevated" sx={{ mb: 3 }}>
        <CardContent sx={{ pb: '12px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              Période :
            </Typography>
            <ToggleButtonGroup
              value={preset}
              exclusive
              onChange={handlePresetChange}
              size="small"
              sx={{
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  fontSize: '0.8rem',
                  borderRadius: '8px !important',
                  mx: '2px',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                },
              }}
            >
              <ToggleButton value="all">Tout</ToggleButton>
              <ToggleButton value="year">12 mois</ToggleButton>
              <ToggleButton value="6months">6 mois</ToggleButton>
              <ToggleButton value="3months">3 mois</ToggleButton>
              <ToggleButton value="custom">Personnalisé</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Date pickers pour mode custom */}
          <Collapse in={preset === 'custom'}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Date de début"
                type="date"
                size="small"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Date de fin"
                type="date"
                size="small"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 160 }}
              />
            </Box>
          </Collapse>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Affichage sur {periodLabel}
          </Typography>
        </CardContent>
      </Card>



      {loading ? (
        <Card variant="elevated" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Barres mensuelles */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="elevated" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Énergie rechargée par mois
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Mois actuel vs mois précédent
                </Typography>
                <Box sx={{ height: 280 }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </Box>
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
                      <Typography variant="caption" color="text.secondary">Évolution</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: monthlyData.currentMonth > monthlyData.previousMonth ? 'error.main' : 'success.main',
                          fontWeight: 500,
                        }}
                      >
                        {monthlyData.currentMonth > monthlyData.previousMonth ? '↑' : '↓'}{' '}
                        {Math.abs(
                          ((monthlyData.currentMonth - monthlyData.previousMonth) / monthlyData.previousMonth) * 100
                        ).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Camembert localisation */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="elevated" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Recharges par localisation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Répartition sur {periodLabel}
                </Typography>
                {locationData.length > 0 ? (
                  <Box sx={{ height: 280 }}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucune donnée de localisation disponible
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ── Graphique évolution consommation ── */}
      <Card variant="elevated">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Évolution de la consommation
            </Typography>
            <ToggleButtonGroup
              value={granularity}
              exclusive
              onChange={(_, v) => v && setGranularity(v)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.25,
                  fontSize: '0.75rem',
                  borderRadius: '6px !important',
                  mx: '2px',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                  },
                },
              }}
            >
              <ToggleButton value="week">Par semaine</ToggleButton>
              <ToggleButton value="month">Par mois</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            kWh/100km et coût moyen — {periodLabel}
          </Typography>

          {evolutionLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
              <CircularProgress />
            </Box>
          ) : consumptionEvolution.length > 0 ? (
            <Box sx={{ height: 320 }}>
              <Line data={evolutionChartData} options={evolutionChartOptions} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
              <Typography variant="body2" color="text.secondary">
                Données insuffisantes pour afficher l'évolution sur cette période.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChartsSection;
