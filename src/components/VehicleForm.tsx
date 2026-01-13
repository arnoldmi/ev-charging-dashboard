import React, { useState } from 'react';
import axios from 'axios';
import { globalStyles } from '../styles/GlobalStyle';

const VehicleForm = ({ userId }: { userId: number }) => {  // Reçois l'ID de l'utilisateur en prop
  const [formData, setFormData] = useState({
    model: 'Volkswagen ID.3',
    batteryCapacity: 77,
    range: 400,
    color: 'Bleu Côte d\'Azur',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/vehicles', {
        userId,  // Ajoute l'ID de l'utilisateur
        ...formData,
      });
      alert('Véhicule enregistré avec succès !');
      console.log(response.data);
    } catch (error) {
      alert('Erreur lors de l\'enregistrement du véhicule.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={globalStyles.typography.h2}>Enregistrer un véhicule</h2>
      <div>
        <label>Modèle :</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required />
      </div>
      <div>
        <label>Capacité de la batterie (kWh) :</label>
        <input type="number" name="batteryCapacity" value={formData.batteryCapacity} onChange={handleChange} required />
      </div>
      <div>
        <label>Autonomie (km) :</label>
        <input type="number" name="range" value={formData.range} onChange={handleChange} required />
      </div>
      <div>
        <label>Couleur :</label>
        <input type="text" name="color" value={formData.color} onChange={handleChange} required />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default VehicleForm;
