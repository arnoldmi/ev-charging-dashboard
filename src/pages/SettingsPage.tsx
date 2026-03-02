import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';

interface Vehicle {
  id?: number;
  model: string;
  batteryCapacity: number;
  range: number;
  color: string;
}

interface UserPreferences {
  electricityPrice: number; // Prix du kWh en €
  alertThreshold: number;  // Seuil d'alerte pour la batterie (en %)
}

const SettingsPage = ({ userId }: { userId: number }) => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    model: 'Volkswagen ID.3',
    batteryCapacity: 77,
    range: 400,
    color: 'Bleu Côte d\'Azur',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    electricityPrice: 0.18, // Prix par défaut en €/kWh
    alertThreshold: 20,    // Seuil par défaut à 20%
  });
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  // Charger les données existantes (si le véhicule est déjà enregistré)
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axiosInstance.get(`/api/vehicles?userId=${userId}`);
        if (response.data.length > 0) {
          setVehicle(response.data[0]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du véhicule:', error);
      }
    };
    fetchVehicle();
  }, [userId]);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Enregistrer ou mettre à jour le véhicule
      if (vehicle.id) {
        await axiosInstance.put(`/api/vehicles/${vehicle.id}`, { userId, ...vehicle });
      } else {
        const response = await axiosInstance.post(`/api/vehicles`, { userId, ...vehicle });
        setVehicle({ ...vehicle, id: response.data.id }); // Met à jour l'ID du véhicule
      }
      // Enregistrer les préférences (à implémenter côté back-end)
      alert('Paramètres enregistrés avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des paramètres.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Paramétrage de l’application</h2>

      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <h3>Mon véhicule : {vehicle.model}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Modèle :</label>
            <input type="text" name="model" value={vehicle.model} onChange={handleVehicleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Capacité de la batterie (kWh) :</label>
            <input type="number" name="batteryCapacity" value={vehicle.batteryCapacity} onChange={handleVehicleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Autonomie (km) :</label>
            <input type="number" name="range" value={vehicle.range} onChange={handleVehicleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Couleur :</label>
            <input type="text" name="color" value={vehicle.color} onChange={handleVehicleChange} required />
          </div>

          <h3>Préférences</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Prix de l’électricité (€/kWh) :</label>
            <input type="number" step="0.01" name="electricityPrice" value={preferences.electricityPrice} onChange={handlePreferencesChange} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Seuil d’alerte batterie (%) :</label>
            <input type="number" name="alertThreshold" value={preferences.alertThreshold} onChange={handlePreferencesChange} required />
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Enregistrer les paramètres
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
