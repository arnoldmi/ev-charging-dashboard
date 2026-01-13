import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { ThemeProvider } from './providers/ThemeProvider';
import HomePage from './pages/HomePage';
import AddUserVehiclePage from './pages/AddUserVehiclePage';
import AddChargePage from './pages/AddChargePage';
import PreferencesPage from './pages/PreferencesPage';

const App: React.FC = () => {
 
  return (
    <UserPreferencesProvider>
    <ThemeProvider>
      <Router>
        {/* Barre de navigation commune à toutes les pages */}
        <nav style={{
          backgroundColor: '#1e1e1e',
          padding: '10px 20px',
          display: 'flex',
          gap: '20px',
          borderBottom: '1px solid #333'
        }}>
          <Link to="/" style={{ color: '#bb86fc', textDecoration: 'none' }}>Accueil</Link>
          <Link to="/add-charge" style={{ color: '#bb86fc', textDecoration: 'none' }}>Ajouter une recharge</Link>
          <Link to="/preferences" style={{ color: '#bb86fc', textDecoration: 'none' }}>Choisir la voiture</Link>
          <Link to="/add-user-vehicle" style={{ color: '#bb86fc', textDecoration: 'none' }}>Ajouter Utilisateur et Véhicules</Link>
        </nav>

        {/* Contenu des pages */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-charge" element={<AddChargePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/add-user-vehicle" element={<AddUserVehiclePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    </UserPreferencesProvider>
  );
};

export default App;
