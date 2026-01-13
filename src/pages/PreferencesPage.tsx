import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '../styles/GlobalStyle';

const PreferencesPage = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer la liste des utilisateurs et véhicules
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3001/api/users');
        setUsers(usersResponse.data);
        const vehiclesResponse = await axios.get('http://localhost:3001/api/vehicles');
        setVehicles(vehiclesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
  }, []);

   useEffect(() => {
    // Récupérer les véhicules de l'utilisateur sélectionné
    if (selectedUser) {
      const fetchUserVehicles = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/vehicles?userId=${selectedUser}`);
          setVehicles(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des véhicules:', error);
        }
      };
      fetchUserVehicles();
    }
  }, [selectedUser]);

  useEffect(() => {
    // Récupérer les préférences de l'utilisateur sélectionné
    if (selectedUser) {
      const fetchPreferences = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/preferences?userId=${selectedUser}`);
          const preferences = response.data;
          if (preferences.selected_vehicle_id) {
            setSelectedVehicle(preferences.selected_vehicle_id);
          }
          // if (preferences.electricity_price) {
          //   setElectricityPrice(preferences.electricity_price);
          // }
          // if (preferences.alert_threshold) {
          //   setAlertThreshold(preferences.alert_threshold);
          // }
        } catch (error) {
          console.error('Erreur lors de la récupération des préférences:', error);
        }
      };
      fetchPreferences();
    }
  }, [selectedUser]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
    alert('Veuillez sélectionner un utilisateur.');
    return;
    }

    try {
      const requestBody: any = {
        userId: selectedUser,
        selectedVehicleId: selectedVehicle,
      };

    // Ajoute les paramètres facultatifs uniquement s'ils sont définis
    // if (electricityPrice !== undefined) {
    //   requestBody.electricityPrice = electricityPrice;
    // }
    // if (alertThreshold !== undefined) {
    //   requestBody.alertThreshold = alertThreshold;
    // }

      await axios.post('http://localhost:3001/api/preferences', requestBody);
      alert('Préférences enregistrées avec succès !');
      navigate('/');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des préférences.');
      console.error(error);
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1 style={globalStyles.typography.h1}>Préférences</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Utilisateur :</label>
          <select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(parseInt(e.target.value))}
            required
            style={{ marginLeft: '10px' }}
          >
            <option value="">Sélectionnez un utilisateur</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <div style={{ marginBottom: '20px' }}>
            <label>Véhicule :</label>
            <select
              value={selectedVehicle || ''}
              onChange={(e) => setSelectedVehicle(parseInt(e.target.value))}
              required
              style={{ marginLeft: '10px' }}
            >
              <option value="">Sélectionnez un véhicule</option>
              {vehicles.map((vehicle: any) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.model} ({vehicle.color})
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default PreferencesPage;
