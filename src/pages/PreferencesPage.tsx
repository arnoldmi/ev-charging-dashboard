// src/pages/PreferencesPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../config/axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, FormControl, InputLabel,
  Select, MenuItem, Button, Alert, Snackbar, CircularProgress,
  Fade, Chip, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Settings as SettingsIcon, Person as PersonIcon,
  DirectionsCar as CarIcon, Check as CheckIcon, Save as SaveIcon,
} from '@mui/icons-material';
import { UserPreferencesContext } from '../context/UserPreferencesContext';

interface User { id: number; name: string; email: string; }
interface Vehicle { id: number; model: string; color: string; battery_capacity: number; range: number; }

const PreferencesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ États pour la "Sélection actuelle" — ne changent qu'après sauvegarde en BDD
  const [savedUserData, setSavedUserData] = useState<User | null>(null);
  const [savedVehicleData, setSavedVehicleData] = useState<Vehicle | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success' as 'success' | 'error',
  });

  const navigate = useNavigate();

  const context = useContext(UserPreferencesContext);
  if (!context) throw new Error('UserPreferencesContext must be used within a UserPreferencesProvider');

  const preferences = context?.preferences || {
    userId: 1, userName: 'Arnold MONGO IBARA', vehicleId: 1,
    vehicleModel: 'Ma Voiture', vehicleColor: "Bleu Côte d'Azur",
  };

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersResponse = await axiosInstance.get(`/api/users`);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setSnackbar({ open: true, message: 'Erreur lors du chargement des utilisateurs.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Charger les véhicules selon l'utilisateur sélectionné dans le formulaire
  useEffect(() => {
    if (selectedUser) {
      const fetchUserVehicles = async () => {
        try {
          const response = await axiosInstance.get(`/api/vehicles/user/${selectedUser}`);
          setVehicles(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des véhicules:', error);
          setSnackbar({ open: true, message: 'Erreur lors du chargement des véhicules.', severity: 'error' });
        }
      };
      fetchUserVehicles();
    } else {
      setVehicles([]);
    }
  }, [selectedUser]);

  // Initialiser le formulaire avec les préférences existantes
  useEffect(() => {
    if (!selectedUser) {
      setSelectedUser(preferences.userId);
      setSelectedVehicle(preferences.vehicleId);
    }
  }, []);

  // ✅ Mettre à jour savedUserData uniquement quand les users sont chargés ET que preferences change
  useEffect(() => {
    if (users.length > 0 && preferences.userId) {
      const user = users.find((u) => u.id === preferences.userId);
      if (user) setSavedUserData(user);
    }
  }, [users, preferences.userId]);

  // ✅ Mettre à jour savedVehicleData uniquement quand vehicles est chargé ET que preferences change
  useEffect(() => {
    if (vehicles.length > 0 && preferences.vehicleId) {
      const vehicle = vehicles.find((v) => v.id === preferences.vehicleId);
      //console.log("maj vehicle: ",vehicle);
      if (vehicle) setSavedVehicleData(vehicle);
    }
  }, [vehicles, preferences.vehicleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setSnackbar({ open: true, message: 'Veuillez sélectionner un utilisateur.', severity: 'error' });
      return;
    }
    if (!selectedVehicle) {
      setSnackbar({ open: true, message: 'Veuillez sélectionner un véhicule.', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/api/preferences`, {
        userId: selectedUser,
        selectedVehicleId: selectedVehicle,
      });

      // ✅ Mettre à jour "Sélection actuelle" seulement après succès BDD
      const newUser = users.find((u) => u.id === selectedUser);
      const newVehicle = vehicles.find((v) => v.id === selectedVehicle);
      if (newUser) setSavedUserData(newUser);
      //console.log("maj newVehicle: ",newVehicle);
      if (newVehicle) setSavedVehicleData(newVehicle);

      setSnackbar({ open: true, message: 'Préférences enregistrées avec succès !', severity: 'success' });
      setTimeout(() => { navigate('/'); }, 1000);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Erreur lors de l'enregistrement des préférences.", severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '12px', backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <SettingsIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>Préférences</Typography>
            <Typography variant="body2" color="text.secondary">Sélectionnez votre utilisateur et véhicule préféré</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Formulaire */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="elevated">
              <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="user-select-label">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />Utilisateur
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="user-select-label"
                      value={selectedUser || ''}
                      onChange={(e) => setSelectedUser(Number(e.target.value))}
                      label="Utilisateur" required
                    >
                      <MenuItem value=""><em>Sélectionnez un utilisateur</em></MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" color="primary" />{user.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedUser && (
                    <Fade in={true}>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="vehicle-select-label">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CarIcon fontSize="small" />Véhicule
                          </Box>
                        </InputLabel>
                        <Select
                          labelId="vehicle-select-label"
                          value={selectedVehicle || ''}
                          onChange={(e) => setSelectedVehicle(Number(e.target.value))}
                          label="Véhicule" required disabled={vehicles.length === 0}
                        >
                          <MenuItem value=""><em>Sélectionnez un véhicule</em></MenuItem>
                          {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CarIcon fontSize="small" color="secondary" />{vehicle.model}
                                </Box>
                                <Chip label={vehicle.color} size="small" sx={{ backgroundColor: 'secondary.main', color: 'secondary.contrastText' }} />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {vehicles.length === 0 && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Aucun véhicule trouvé pour cet utilisateur.
                          </Typography>
                        )}
                      </FormControl>
                    </Fade>
                  )}

                  <Button
                    type="submit" variant="contained" fullWidth size="large"
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

          {/* ✅ Sélection actuelle — reflète uniquement la BDD */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="filled" sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Sélection actuelle</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Utilisateur</Typography>
                  {savedUserData ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{savedUserData.name}</Typography>
                      <CheckIcon color="success" fontSize="small" />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Aucun utilisateur sélectionné</Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Véhicule</Typography>
                  {savedVehicleData ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CarIcon color="secondary" />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{savedVehicleData.model}</Typography>
                        <CheckIcon color="success" fontSize="small" />
                      </Box>
                      <Chip label={savedVehicleData.color} size="small" sx={{ backgroundColor: 'secondary.main', color: 'secondary.contrastText' }} />
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">🔋 Batterie: {savedVehicleData.battery_capacity}kWh</Typography>
                        <Typography variant="caption" color="text.secondary">🛣️ Autonomie: {savedVehicleData.range} km</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Aucun véhicule sélectionné</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default PreferencesPage;