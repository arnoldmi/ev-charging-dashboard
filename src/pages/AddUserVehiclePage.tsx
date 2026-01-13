import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import VehicleForm from '../components/VehicleForm';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '../styles/GlobalStyle';

const AddUserVehiclePage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={globalStyles.typography.h1}>Ajouter un utilisateur ou un véhicule</h1>
      <div style={{ marginBottom: '30px' }}>
        <UserForm onUserCreated={(id: number) => setUserId(id)}/>
      </div>
      <div>
        <VehicleForm userId={1} /> {/* Remplace par l'ID dynamique de l'utilisateur */}
      </div>
    </div>
  );
};

export default AddUserVehiclePage;
