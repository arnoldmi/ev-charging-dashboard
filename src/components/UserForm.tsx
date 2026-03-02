// src/components/UserForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
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
  IconButton,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface UserFormProps {
  onUserCreated: (id: number) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: 'Arnold MI',
    email: 'arnold@exemple.com',
    password: 'motdepasse1234',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(`/api/users`, formData);
      
      setSnackbar({
        open: true,
        message: 'Utilisateur enregistré avec succès !',
        severity: 'success',
      });

      onUserCreated(response.data.id);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'enregistrement de l\'utilisateur.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card variant="elevated" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
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
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Enregistrer un utilisateur
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Créez un nouveau compte utilisateur
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Nom */}
          <TextField
            fullWidth
            type="text"
            name="name"
            label="Nom complet"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddIcon />
                </InputAdornment>
              ),
            }}
            helperText="Votre nom et prénom"
          />

          {/* Email */}
          <TextField
            fullWidth
            type="email"
            name="email"
            label="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            helperText="Utilisé pour la connexion"
          />

          {/* Mot de passe */}
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Minimum 8 caractères recommandé"
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'utilisateur'}
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

export default UserForm;