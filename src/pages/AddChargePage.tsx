import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChargeForm from '../components/ChargeForm';
import { Card } from '../components/Card';
import { FaBolt, FaEuroSign, FaCar, FaPiggyBank } from 'react-icons/fa';
import { globalStyles } from '../styles/GlobalStyle';
import { UserPreferencesContext } from '../context/UserPreferencesContext';

interface Charge {
  id: number;
  date: string;
  kwh: number;
  cost: number;
  mileage: number;
  location: string;
}

const AddChargePage = () => {
  // Le contexte
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

  const [userId, setUserId] = useState<number | null>(1); // Remplace par l'ID dynamique de l'utilisateur
  const [vehicleId, setVehicleId] = useState<number | null>(1); // Remplace par l'ID dynamique du véhicule
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupérer les recharges précédentes
  useEffect(() => {
    
    if (preferencesLoading) return;

    const fetchCharges = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/charges', {
          params: { userId: preferences.userId, vehicleId: preferences.vehicleId },
        });
        // Trier les recharges de la plus récente à la plus ancienne
        const sortedCharges = response.data.sort((a: Charge, b: Charge) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setCharges(sortedCharges);
      } catch (error) {
        console.error('Erreur lors de la récupération des recharges:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharges();
  }, []);

 
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Titre */}
      <h1 style={globalStyles.typography.h1}>
        Ajouter une recharge
      </h1>

      {userId && vehicleId && (
      <>
        {/* Formulaire de recharge */}
        <Card>
          <ChargeForm userId={userId} vehicleId={vehicleId} />
        </Card>

        {/* Tableau des recharges précédentes */}
        <Card title="Historique des recharges">
          {loading ? (
            <p>Chargement des recharges...</p>
          ) : charges.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#333' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Kilométrage (km)</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Énergie (kWh)</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Coût (€)</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#fff' }}>Lieu</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((charge) => (
                    <tr key={charge.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '10px', color: '#ccc' }}>{new Date(charge.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', color: '#ccc' }}>{charge.mileage}</td>
                      <td style={{ padding: '10px', color: '#ccc' }}>{charge.kwh}</td>
                      <td style={{ padding: '10px', color: '#ccc' }}>{charge.cost}</td>
                      <td style={{ padding: '10px', color: '#ccc' }}>{charge.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucune recharge enregistrée.</p>
          )}
        </Card>
      </>
      )}
    </div>
  );
};

export default AddChargePage;
