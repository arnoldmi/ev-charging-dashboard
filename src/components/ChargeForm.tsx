import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ChargeFormProps {
  userId: number;
  vehicleId: number;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ userId, vehicleId }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    kwh: 0,
    cost: 0,
    mileage: 0,  // Ajout du kilométrage
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'kwh' || name === 'cost' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/charges', {
        userId,
        vehicleId,
        ...formData,
      });
      alert('Recharge enregistrée avec succès !');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        kwh: 0,
        cost: 0,
        mileage: 0,  // Réinitialisation du kilométrage
        location: '',
      });
    } catch (error) {
      alert('Erreur lors de l\'enregistrement de la recharge.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Nouvelle recharge</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Date :</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Kilométrage (km) :</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Quantité (kWh) :</label>
          <input
            type="number"
            step="0.01"
            name="kwh"
            value={formData.kwh}
            onChange={handleChange}
            pattern="[0-9]+([,\.][0-9]{1,2})?"
            title="Format valide : 25 ou 25,50 ou 25.50"
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Coût (€) :</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            pattern="[0-9]+([,\.][0-9]{1,2})?"
            title="Format valide : 10 ou 10,50 ou 10.50"
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Lieu :</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Enregistrer la recharge
        </button>
      </form>
    </div>
  );
};

export default ChargeForm;
