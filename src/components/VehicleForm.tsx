// src/components/VehicleForm.tsx
import React, { useState } from 'react';
import axiosInstance from '../config/axios';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  BatteryChargingFull as BatteryIcon,
  Route as RouteIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface VehicleFormProps {
  userId: number;
  onVehicleCreated?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ userId, onVehicleCreated }) => {
  const [formData, setFormData] = useState({
    model: 'Volkswagen ID.3',
    batteryCapacity: '77',
    range: '400',
    color: 'Bleu Côte d\'Azur',
  });
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `/api/vehicles`, 
        {
        userId,
        model: formData.model,
        batteryCapacity: parseInt(formData.batteryCapacity),
        range: parseInt(formData.range),
        color: formData.color,
      });

      setSnackbar({
        open: true,
        message: 'Véhicule enregistré avec succès !',
        severity: 'success',
      });

      console.log(response.data);
      
      // Appeler le callback si fourni
      if (onVehicleCreated) {
        onVehicleCreated();
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'enregistrement du véhicule.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card variant="elevated" sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '12px',
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
            }}
          >
            <CarIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Enregistrer un véhicule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajoutez un nouveau véhicule électrique
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Modèle */}
          <TextField
            fullWidth
            type="text"
            name="model"
            label="Modèle du véhicule"
            value={formData.model}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CarIcon />
                </InputAdornment>
              ),
            }}
            helperText="Marque et modèle (ex: Volkswagen ID.3)"
          />

          {/* Capacité de la batterie */}
          <TextField
            fullWidth
            type="number"
            name="batteryCapacity"
            label="Capacité de la batterie"
            value={formData.batteryCapacity}
            onChange={handleChange}
            required
            inputProps={{
              min: '1',
            }}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BatteryIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">kWh</InputAdornment>
              ),
            }}
            helperText="Capacité totale de la batterie"
          />

          {/* Autonomie */}
          <TextField
            fullWidth
            type="number"
            name="range"
            label="Autonomie"
            value={formData.range}
            onChange={handleChange}
            required
            inputProps={{
              min: '1',
            }}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RouteIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">km</InputAdornment>
              ),
            }}
            helperText="Autonomie WLTP annoncée"
          />

          {/* Couleur */}
          <TextField
            fullWidth
            type="text"
            name="color"
            label="Couleur"
            value={formData.color}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaletteIcon />
                </InputAdornment>
              ),
            }}
            helperText="Couleur de la carrosserie"
          />

          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
            sx={{ py: 1.5 }}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule'}
          </Button>
        </Box>

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
      </CardContent>
    </Card>
  );
};

export default VehicleForm;