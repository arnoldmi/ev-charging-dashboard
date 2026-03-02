// src/components/ChargeForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../config/axios';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Snackbar, InputAdornment,
} from '@mui/material';
import {
  BatteryChargingFull as BatteryIcon,
  Euro as EuroIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface ChargeFormProps {
  userId: number;
  vehicleId: number;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ userId, vehicleId }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    kwh: '',
    cost: '',
    mileage: '',
    location: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post(`/api/charges`, {
        userId,
        vehicleId,
        date: formData.date,
        kwh: parseFloat(formData.kwh),
        cost: parseFloat(formData.cost),
        mileage: parseInt(formData.mileage),
        location: formData.location,
      });

      setSnackbar({
        open: true,
        message: 'Recharge enregistrée avec succès !',
        severity: 'success',
      });

      // Réinitialisation du formulaire
      setFormData({
        date: new Date().toISOString().split('T')[0],
        kwh: '',
        cost: '',
        mileage: '',
        location: '',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'enregistrement de la recharge.',
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
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <BatteryIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Nouvelle recharge
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enregistrez les détails de votre recharge
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Date */}
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Date"
            value={formData.date}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Kilométrage */}
          <TextField
            fullWidth
            type="number"
            name="mileage"
            label="Kilométrage"
            value={formData.mileage}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SpeedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">km</InputAdornment>
              ),
            }}
            helperText="Kilométrage actuel du véhicule"
          />

          {/* Quantité en kWh */}
          <TextField
            fullWidth
            type="number"
            name="kwh"
            label="Quantité d'énergie"
            value={formData.kwh}
            onChange={handleChange}
            required
            inputProps={{
              step: '0.01',
              min: '0',
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
            helperText="Énergie rechargée (ex: 25.50)"
          />

          {/* Coût */}
          <TextField
            fullWidth
            type="number"
            name="cost"
            label="Coût"
            value={formData.cost}
            onChange={handleChange}
            required
            inputProps={{
              step: '0.01',
              min: '0',
            }}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EuroIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">€</InputAdornment>
              ),
            }}
            helperText="Coût total de la recharge (ex: 10.50)"
          />

          {/* Lieu */}
          <TextField
            fullWidth
            type="text"
            name="location"
            label="Lieu de recharge"
            value={formData.location}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            helperText="Ville ou adresse de la borne"
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer la recharge'}
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

export default ChargeForm;