// src/pages/HomePage.tsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  Fade,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Import Grid2 pour MUI v6+
import {
  AccountCircle as AccountIcon,
  DirectionsCar as CarIcon,
  Savings as SavingsIcon,
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import UserVehicleHeader from '../components/UserVehicleHeader';
import CumulativeStats from '../components/CumulativeStats';
import StatsSummary from '../components/StatsSummary';
import ChartsSection from '../components/ChartsSection';


const HomePage: React.FC = () => {
  const [charges, setCharges] = useState([]);
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error('UserPreferencesContext must be used within a UserPreferencesProvider');
  }

  const preferences = context?.preferences || {
    userId: 1,
    userName: 'Arnold MONGO IBARA',
    vehicleId: 1,
    vehicleModel: 'Volkswagen ID.3',
    vehicleColor: 'Bleu Côte d\'Azur',
  };

  const preferencesLoading = context?.loading;

  const [stats, setStats] = useState({
    avgConsumption: 0,
    avgCostPerKwh: 0,
    avgCostPerKm: 0,
  });

  const [cumulativeStats, setCumulativeStats] = useState({
    totalMileage: 0,
    totalKwh: 0,
    totalCost: 0,
    totalDistance: 0,
    totalCharges: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (preferencesLoading) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, cumulativeResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/stats/global', {
            params: { userId: preferences.userId, vehicleId: preferences.vehicleId },
          }),
          axios.get('http://localhost:3001/api/stats/cumulative', {
            params: { userId: preferences.userId, vehicleId: preferences.vehicleId },
          }),
        ]);

        setStats(statsResponse.data);
        setCumulativeStats(cumulativeResponse.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preferences.userId, preferences.vehicleId, preferencesLoading]);

  if (loading || preferencesLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 500 }}>
          Tableau de bord
        </Typography>

        <UserVehicleHeader
          userName={preferences.userName}
          vehicleModel={preferences.vehicleModel}
          vehicleColor={preferences.vehicleColor}
        />

        {/* Section stats cumulés */}
        <CumulativeStats {...cumulativeStats} />
        
        {/* Section stats les moyennes */}        
        <StatsSummary {...stats} />

        {/* Section des graphiques */}
        <ChartsSection userId={preferences.userId} vehicleId={preferences.vehicleId} />

        {/* Rappel PEE */}
        <Alert
          severity="info"
          icon={<SavingsIcon sx={{ fontSize: 28 }} />}
          sx={{
            backgroundColor: 'tertiary.main',
            color: 'tertiary.contrastText',
            '& .MuiAlert-icon': {
              color: '#FFD700',
            },
            borderRadius: '12px',
          }}
        >
          <AlertTitle sx={{ fontWeight: 500, fontSize: '16px' }}>
            Rappel PEE - {preferences.userName}
          </AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Vous pouvez utiliser les <strong>5000€ de votre PEE en 2025</strong> (et{' '}
            <strong>6000€ en 2026</strong>) pour financer des projets liés à votre{' '}
            {preferences.vehicleModel}.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Palaiseau, Région Parisienne
          </Typography>
        </Alert>
      </Box>
    </Fade>
  );
};

export default HomePage;