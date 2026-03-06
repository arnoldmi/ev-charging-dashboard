// src/pages/ManageUsersVehiclesPage.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  PersonAdd as PersonAddIcon,
  DirectionsCar as CarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  BatteryChargingFull as BatteryIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import UserForm from '../components/UserForm';
import VehicleForm from '../components/VehicleForm';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Vehicle {
  id: number;
  user_id: number;
  model: string;
  battery_capacity: number;
  range: number;
  color: string;
}

const ManageUsersVehiclesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialogs
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [selectedUserForVehicle, setSelectedUserForVehicle] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'user' | 'vehicle' | null;
    id: number | null;
    name: string;
  }>({
    open: false,
    type: null,
    id: null,
    name: '',
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });

  // État pour stocker l'utilisateur nouvellement créé
  const [newUserId, setNewUserId] = useState<number | null>(null);

  // Charger les utilisateurs et véhicules
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, vehiclesResponse] = await Promise.all([
        axiosInstance.get('/api/users'),
        axiosInstance.get('/api/vehicles'),
      ]);
      
      console.log('Users:', usersResponse.data);
      console.log('Vehicles:', vehiclesResponse.data);
      
      setUsers(usersResponse.data);
      setVehicles(vehiclesResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des données.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Callback quand un utilisateur est créé
  const handleUserCreated = (userId: number) => {
    setNewUserId(userId);
    setSelectedUserForVehicle(userId);
    setShowAddUserDialog(false);
    setSnackbar({
      open: true,
      message: 'Utilisateur créé avec succès ! Vous pouvez maintenant ajouter un véhicule.',
      severity: 'success',
    });
    fetchData();
    // Ouvrir automatiquement le dialog d'ajout de véhicule
    setTimeout(() => setShowAddVehicleDialog(true), 500);
  };

  // Ouvrir le dialog d'ajout de véhicule avec sélection d'utilisateur
  const handleOpenAddVehicleDialog = (userId?: number) => {
    if (userId) {
      setSelectedUserForVehicle(userId);
    } else if (users.length > 0) {
      setSelectedUserForVehicle(users[0].id);
    }
    setShowAddVehicleDialog(true);
  };

  // Callback quand un véhicule est ajouté
  const handleVehicleAdded = () => {
    setShowAddVehicleDialog(false);
    setSelectedUserForVehicle(null);
    setSnackbar({
      open: true,
      message: 'Véhicule ajouté avec succès !',
      severity: 'success',
    });
    fetchData();
  };

  // Ouvrir le dialog de suppression
  const handleOpenDeleteDialog = (type: 'user' | 'vehicle', id: number, name: string) => {
    setDeleteDialog({
      open: true,
      type,
      id,
      name,
    });
  };

  // Fermer le dialog de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      type: null,
      id: null,
      name: '',
    });
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!deleteDialog.id) return;

    try {
      await axiosInstance.delete(`/api/users/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: 'Utilisateur supprimé avec succès.',
        severity: 'success',
      });
      fetchData();
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erreur lors de la suppression de l\'utilisateur.',
        severity: 'error',
      });
    }
  };

  // Supprimer un véhicule
  const handleDeleteVehicle = async () => {
    if (!deleteDialog.id) return;

    try {
      await axiosInstance.delete(`/api/vehicles/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: 'Véhicule supprimé avec succès.',
        severity: 'success',
      });
      fetchData();
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erreur lors de la suppression du véhicule.',
        severity: 'error',
      });
    }
  };

  // Obtenir les véhicules d'un utilisateur
  const getUserVehicles = (userId: number) => {
    console.log('Getting vehicles for user:', userId);
    console.log('All vehicles:', vehicles);
    const userVehicles = vehicles.filter((v) => Number(v.user_id) === Number(userId));
    console.log('User vehicles:', userVehicles);
    return userVehicles;
  };

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
            <PersonIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              Gestion des utilisateurs et véhicules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajoutez, modifiez ou supprimez vos utilisateurs et leurs véhicules
            </Typography>
          </Box>
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowAddUserDialog(true)}
          >
            Ajouter un utilisateur
          </Button>
          <Button
            variant="outlined"
            startIcon={<CarIcon />}
            onClick={() => handleOpenAddVehicleDialog()}
            disabled={users.length === 0}
          >
            Ajouter un véhicule
          </Button>
        </Box>

        {users.length === 0 && !loading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Aucun utilisateur enregistré. Commencez par ajouter un utilisateur.
          </Alert>
        )}

        {/* Liste des utilisateurs et leurs véhicules */}
        <Grid container spacing={3}>
          {users.map((user) => {
            const userVehicles = getUserVehicles(user.id);
            
            return (
              <Grid size={{ xs: 12, lg: 6 }} key={user.id}>
                <Card variant="elevated">
                  <CardContent>
                    {/* En-tête utilisateur */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: 'primary.main',
                          mr: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Tooltip title="Supprimer l'utilisateur">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog('user', user.id, user.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Véhicules de l'utilisateur */}
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                      Véhicules ({userVehicles.length})
                    </Typography>

                    {userVehicles.length === 0 ? (
                      <Box>
                        <Alert severity="info" sx={{ mb: 1 }}>
                          Aucun véhicule enregistré pour cet utilisateur.
                        </Alert>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CarIcon />}
                          onClick={() => handleOpenAddVehicleDialog(user.id)}
                        >
                          Ajouter un véhicule
                        </Button>
                      </Box>
                    ) : (
                      <List disablePadding>
                        {userVehicles.map((vehicle) => (
                          <ListItem
                            key={vehicle.id}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '8px',
                              mb: 1,
                              '&:last-child': { mb: 0 },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  backgroundColor: 'secondary.main',
                                  color: 'secondary.contrastText',
                                }}
                              >
                                <CarIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {vehicle.model}
                                  </Typography>
                                  <Chip
                                    label={vehicle.color}
                                    size="small"
                                    sx={{
                                      backgroundColor: 'secondary.main',
                                      color: 'secondary.contrastText',
                                      height: 20,
                                      fontSize: '0.75rem',
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    🔋 {vehicle.battery_capacity} kWh
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    🛣️ {vehicle.range} km
                                  </Typography>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="Supprimer le véhicule">
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() =>
                                    handleOpenDeleteDialog('vehicle', vehicle.id, vehicle.model)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Dialog - Ajouter un utilisateur */}
        <Dialog
          open={showAddUserDialog}
          onClose={() => setShowAddUserDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogContent>
            <UserForm onUserCreated={handleUserCreated} />
          </DialogContent>
        </Dialog>

        {/* Dialog - Ajouter un véhicule */}
        <Dialog
          open={showAddVehicleDialog}
          onClose={() => {
            setShowAddVehicleDialog(false);
            setSelectedUserForVehicle(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Ajouter un véhicule</DialogTitle>
          <DialogContent>
            {users.length === 0 ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Vous devez d'abord créer un utilisateur avant d'ajouter un véhicule.
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                {/* Sélecteur d'utilisateur */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Sélectionnez l'utilisateur :
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {users.map((user) => (
                      <Chip
                        key={user.id}
                        label={user.name}
                        icon={<PersonIcon />}
                        onClick={() => setSelectedUserForVehicle(user.id)}
                        color={selectedUserForVehicle === user.id ? 'primary' : 'default'}
                        variant={selectedUserForVehicle === user.id ? 'filled' : 'outlined'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Formulaire véhicule */}
                {selectedUserForVehicle && (
                  <VehicleForm 
                    userId={selectedUserForVehicle} 
                    onVehicleCreated={handleVehicleAdded}
                  />
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog - Confirmation de suppression */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="error" />
              Confirmer la suppression
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Cette action est irréversible. Toutes les données associées seront supprimées.
            </Alert>
            <Typography variant="body1">
              Êtes-vous sûr de vouloir supprimer{' '}
              {deleteDialog.type === 'user' ? "l'utilisateur" : 'le véhicule'}{' '}
              <strong>{deleteDialog.name}</strong> ?
            </Typography>
            {deleteDialog.type === 'user' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Note : Tous les véhicules et recharges associés à cet utilisateur seront également
                supprimés.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
            <Button
              onClick={deleteDialog.type === 'user' ? handleDeleteUser : handleDeleteVehicle}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default ManageUsersVehiclesPage;