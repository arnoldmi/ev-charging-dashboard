// src/pages/AddChargePage.tsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';
import ChargeForm from '../components/ChargeForm';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Fade,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Delete as DeleteIcon,
  BatteryChargingFull as BatteryIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { UserPreferencesContext } from '../context/UserPreferencesContext';


interface Charge {
  id: number;
  date: string;
  kwh: number;
  cost: number;
  mileage: number;
  location: string;
  user_id: number;
  vehicle_id: number;
}

// Fonction utilitaire pour convertir en nombre
const toNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Fonction utilitaire pour convertir en entier
const toInteger = (value: any): number => {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
};

const AddChargePage: React.FC = () => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    chargeId: number | null;
    chargeDate: string;
  }>({
    open: false,
    chargeId: null,
    chargeDate: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error('UserPreferencesContext must be used within a UserPreferencesProvider');
  }

  const preferences = context?.preferences || {
    userId: 1,
    userName: 'Arnold MONGO IBARA',
    vehicleId: 1,
    vehicleModel: 'Volkswagen ID.3',
    vehicleColor: 'Bleu Côte d\'Azur',
  };

  // Charger les recharges
  const fetchCharges = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/charges', {
        params: {
          userId: preferences.userId,
          vehicleId: preferences.vehicleId,
        },
      });
      
      // Convertir les valeurs numériques et trier par date décroissante
      const sortedCharges = response.data
        .map((charge: any) => ({
          id: toInteger(charge.id),
          date: charge.date,
          kwh: toNumber(charge.kwh),
          cost: toNumber(charge.cost),
          mileage: toInteger(charge.mileage),
          location: charge.location || '',
          user_id: toInteger(charge.user_id),
          vehicle_id: toInteger(charge.vehicle_id),
        }))
        .sort((a: Charge, b: Charge) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      
      console.log('Charges chargées:', sortedCharges);
      setCharges(sortedCharges);
    } catch (error) {
      console.error('Erreur lors du chargement des recharges:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des recharges.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preferences.userId && preferences.vehicleId) {
      fetchCharges();
    }
  }, [preferences.userId, preferences.vehicleId]);

  // Callback après ajout d'une recharge
  const handleChargeAdded = () => {
    fetchCharges(); // Rafraîchir la liste
    setSnackbar({
      open: true,
      message: 'Recharge ajoutée avec succès !',
      severity: 'success',
    });
  };

  // Ouvrir le dialog de suppression
  const handleOpenDeleteDialog = (chargeId: number, date: string) => {
    setDeleteDialog({
      open: true,
      chargeId,
      chargeDate: new Date(date).toLocaleDateString('fr-FR'),
    });
  };

  // Fermer le dialog de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      chargeId: null,
      chargeDate: '',
    });
  };

  // Supprimer une recharge
  const handleDeleteCharge = async () => {
    if (!deleteDialog.chargeId) return;

    try {
      await axiosInstance.delete(`/api/charges/${deleteDialog.chargeId}`);
      
      setSnackbar({
        open: true,
        message: 'Recharge supprimée avec succès.',
        severity: 'success',
      });
      
      fetchCharges(); // Rafraîchir la liste
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Erreur lors de la suppression de la recharge.',
        severity: 'error',
      });
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
            <BatteryIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              Recharges
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajoutez et gérez vos recharges pour {preferences.vehicleModel}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Formulaire d'ajout */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <ChargeForm
              userId={preferences.userId}
              vehicleId={preferences.vehicleId}
              onChargeAdded={handleChargeAdded}
            />
          </Grid>

          {/* Liste des recharges */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Historique des recharges ({charges.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Liste de toutes vos recharges
                </Typography>
              </Box>

              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : charges.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <BatteryIcon
                    sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Aucune recharge enregistrée
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ajoutez votre première recharge avec le formulaire ci-contre
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Lieu</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Kilométrage
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Énergie
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Coût
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          €/kWh
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {charges.map((charge) => {
                        // Sécuriser les calculs
                        const kwh = toNumber(charge.kwh);
                        const cost = toNumber(charge.cost);
                        const mileage = toInteger(charge.mileage);
                        const costPerKwh = kwh > 0 ? cost / kwh : 0;
                        
                        return (
                          <TableRow
                            key={charge.id}
                            hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatDate(charge.date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={charge.location}
                                size="small"
                                sx={{
                                  backgroundColor: 'secondary.main',
                                  color: 'secondary.contrastText',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {mileage.toLocaleString('fr-FR')} km
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {kwh.toFixed(2)} kWh
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {cost.toFixed(2)} €
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="text.secondary">
                                {costPerKwh.toFixed(3)} €
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Supprimer cette recharge">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleOpenDeleteDialog(charge.id, charge.date)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog de confirmation de suppression */}
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
              Cette action est irréversible.
            </Alert>
            <Typography variant="body1">
              Êtes-vous sûr de vouloir supprimer la recharge du{' '}
              <strong>{deleteDialog.chargeDate}</strong> ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
            <Button
              onClick={handleDeleteCharge}
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

export default AddChargePage;