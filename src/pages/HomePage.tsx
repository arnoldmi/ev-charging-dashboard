// src/pages/HomePage.tsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { Card } from '../components/Card';
import { StatBlock } from '../components/StatBlock';
import { FaPiggyBank } from 'react-icons/fa6';
import { globalStyles } from '../styles/GlobalStyle';
import UserVehicleHeader from '../components/UserVehicleHeader';
import CumulativeStats from '../components/CumulativeStats';
import StatsSummary from '../components/StatsSummary';

const HomePage = () => {
  const [charges, setCharges] = useState([]);
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error("UserPreferencesContext must be used within a UserPreferencesProvider");
  }
  // Définir des valeurs par défaut si le contexte est undefined
  const preferences = context?.preferences || {
    userId: 1,
    userName: 'Arnold MONGO IBARA',
    vehicleId: 1,
    vehicleModel: 'Volkswagen ID.3',
    vehicleColor: 'Bleu Côte d\'Azur',
  };
  
  const preferencesLoading = context?.loading;

  const [userVehicleInfo, setUserVehicleInfo] = useState({
    userId: 0,
    userName: '',
    vehicleId: 0,
    vehicleModel: '',
    vehicleColor: '',
  });
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

    // Récupération des données
    const fetchData = async () => {
      try {
        setLoading(true);
        // console.log("ID auto explolité: ", preferences.vehicleId); // Vérifie les données reçues
        const [statsResponse, cumulativeResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/stats/global', { params: { userId: preferences.userId, vehicleId: preferences.vehicleId } }),
          axios.get('http://localhost:3001/api/stats/cumulative', { params: { userId: preferences.userId, vehicleId: preferences.vehicleId } }),
        ]);
        
        // console.log("Données statistiques reçues :", statsResponse.data); // Vérifie les données reçues
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
      <div style={{ backgroundColor: '#121212', color: '#fff', padding: '20px' }}>
        Chargement des données...
      </div>
    );
  }

  return (
    <div>
      <h1 style={globalStyles.typography.h1}>Tableau de bord</h1>
      <UserVehicleHeader
        userName={preferences.userName}
        vehicleModel={preferences.vehicleModel}
        vehicleColor={preferences.vehicleColor}
      />
        
      <CumulativeStats {...cumulativeStats} />
      <StatsSummary {...stats} />

      {/* Rappel PEE */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <FaPiggyBank style={{ color: '#ffd700', fontSize: '20px', marginRight: '10px' }} />
          <h3 style={{ margin: 0 }}>Rappel PEE - Arnold MONGO IBARA</h3>
        </div>
        <p>
          Vous pouvez utiliser les <strong>5000€ de votre PEE en 2025</strong> (et <strong>6000€ en 2026</strong>) pour financer des projets liés à votre Volkswagen ID.3.
        </p>
        <p style={{ fontSize: '12px', color: '#a5a0a5' }}>Palaiseau, Région Parisienne</p>
      </Card>
    </div>
  );
};

export default HomePage;
