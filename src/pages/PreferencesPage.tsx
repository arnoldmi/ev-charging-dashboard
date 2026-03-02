// src/pages/PreferencesPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Check as CheckIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Vehicle {
  id: number;
  model: string;
  color: string;
  batteryCapacity: number;
  range: number;
}

const PreferencesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const navigate = useNavigate();
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;


  // Récupérer les utilisateurs au chargement
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersResponse = await axiosInstance.get(`/api/users`);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des utilisateurs.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Récupérer les véhicules quand un utilisateur est sélectionné
  useEffect(() => {
    if (selectedUser) {
      const fetchUserVehicles = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/vehicles?userId=${selectedUser}`
          );
          setVehicles(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des véhicules:', error);
          setSnackbar({
            open: true,
            message: 'Erreur lors du chargement des véhicules.',
            severity: 'error',
          });
        }
      };
      fetchUserVehicles();
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [selectedUser]);

  // Récupérer les préférences existantes
  useEffect(() => {
    if (selectedUser) {
      const fetchPreferences = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/preferences?userId=${selectedUser}`
          );
          const preferences = response.data;
          if (preferences.selected_vehicle_id) {
            setSelectedVehicle(preferences.selected_vehicle_id);
          }
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
      setSnackbar({
        open: true,
        message: 'Veuillez sélectionner un utilisateur.',
        severity: 'error',
      });
      return;
    }

    if (!selectedVehicle) {
      setSnackbar({
        open: true,
        message: 'Veuillez sélectionner un véhicule.',
        severity: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post(`/api/preferences`, {
        userId: selectedUser,
        selectedVehicleId: selectedVehicle,
      });

      setSnackbar({
        open: true,
        message: 'Préférences enregistrées avec succès !',
        severity: 'success',
      });

      // Redirection après 1 seconde
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'enregistrement des préférences.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Obtenir les détails de l'utilisateur et du véhicule sélectionnés
  const selectedUserData = users.find((u) => u.id === selectedUser);
  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '12px',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <SettingsIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              Préférences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sélectionnez votre utilisateur et véhicule préféré
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Formulaire de sélection */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="elevated">
              <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                  {/* Sélection de l'utilisateur */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="user-select-label">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        Utilisateur
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="user-select-label"
                      value={selectedUser || ''}
                      onChange={(e) => setSelectedUser(Number(e.target.value))}
                      label="Utilisateur"
                      required
                    >
                      <MenuItem value="">
                        <em>Sélectionnez un utilisateur</em>
                      </MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" color="primary" />
                            {user.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Sélection du véhicule (affiché seulement si utilisateur sélectionné) */}
                  {selectedUser && (
                    <Fade in={true}>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="vehicle-select-label">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CarIcon fontSize="small" />
                            Véhicule
                          </Box>
                        </InputLabel>
                        <Select
                          labelId="vehicle-select-label"
                          value={selectedVehicle || ''}
                          onChange={(e) => setSelectedVehicle(Number(e.target.value))}
                          label="Véhicule"
                          required
                          disabled={vehicles.length === 0}
                        >
                          <MenuItem value="">
                            <em>Sélectionnez un véhicule</em>
                          </MenuItem>
                          {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CarIcon fontSize="small" color="secondary" />
                                  {vehicle.model}
                                </Box>
                                <Chip
                                  label={vehicle.color}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'secondary.main',
                                    color: 'secondary.contrastText',
                                  }}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {vehicles.length === 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Aucun véhicule trouvé pour cet utilisateur.
                          </Typography>
                        )}
                      </FormControl>
                    </Fade>
                  )}

                  {/* Bouton de soumission */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || !selectedUser || !selectedVehicle}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{ py: 1.5 }}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les préférences'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Aperçu de la sélection */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="filled" sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Sélection actuelle
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Utilisateur sélectionné */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: 'block' }}
                  >
                    Utilisateur
                  </Typography>
                  {selectedUserData ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedUserData.name}
                      </Typography>
                      <CheckIcon color="success" fontSize="small" />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun utilisateur sélectionné
                    </Typography>
                  )}
                </Box>

                {/* Véhicule sélectionné */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: 'block' }}
                  >
                    Véhicule
                  </Typography>
                  {selectedVehicleData ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CarIcon color="secondary" />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedVehicleData.model}
                        </Typography>
                        <CheckIcon color="success" fontSize="small" />
                      </Box>
                      <Chip
                        label={selectedVehicleData.color}
                        size="small"
                        sx={{
                          backgroundColor: 'secondary.main',
                          color: 'secondary.contrastText',
                        }}
                      />
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          🔋 Batterie: {selectedVehicleData.batteryCapacity} kWh
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          🛣️ Autonomie: {selectedVehicleData.range} km
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun véhicule sélectionné
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default PreferencesPage;