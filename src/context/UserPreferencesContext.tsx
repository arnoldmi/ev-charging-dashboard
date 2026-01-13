// src/context/UserPreferencesContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserPreferences {
  userId: number;
  userName: string;
  vehicleId: number;
  vehicleModel: string;
  vehicleColor: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setUserId: (userId: number) => void;
  setVehicleId: (vehicleId: number) => void;
  loading: boolean;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    userId: 1, // Valeur par défaut (Arnold MONGO IBARA)
    userName: 'Arnold MONGO IBARA',
    vehicleId: 1, // Valeur par défaut (Volkswagen ID.3 bleu Côte d'Azur)
    vehicleModel: 'Volkswagen ID.3',
    vehicleColor: 'Bleu Côte d\'Azur',
  });
  const [loading, setLoading] = useState(true);

  // Récupérer les préférences utilisateur au chargement
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/preferences', {});
        setPreferences({
          userId: response.data.user_id || 1,
          userName: response.data.user_name || 'Arnold MONGO IBARA',
          vehicleId: response.data.vehicle_id || 1,
          vehicleModel: response.data.vehicle_model || 'Volkswagen ID.3',
          vehicleColor: response.data.vehicle_color || 'Bleu Côte d\'Azur',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des préférences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const setUserId = (userId: number) => {
    setPreferences((prev) => ({ ...prev, userId }));
  };

  const setVehicleId = (vehicleId: number) => {
    setPreferences((prev) => ({ ...prev, vehicleId }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, setUserId, setVehicleId, loading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
