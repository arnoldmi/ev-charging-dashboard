import React, { useState } from 'react';
import axios from 'axios';
import { globalStyles } from '../styles/GlobalStyle';

interface UserFormProps {
  onUserCreated: (id: number) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: 'Arnold MI',
    email: 'arnold@exemple.com',
    password: 'motdepasse1234',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users', formData);
      alert('Utilisateur enregistré avec succès !');
      onUserCreated(response.data.id);  // Passe l'ID de l'utilisateur au parent
    } catch (error) {
      alert('Erreur lors de l\'enregistrement de l\'utilisateur.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={globalStyles.typography.h2}>Enregistrer un utilisateur</h2>
      <div>
        <label>Nom :</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email :</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Mot de passe :</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default UserForm;
