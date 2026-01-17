// src/components/UserVehicleHeader.tsx
import React from 'react';
import { Box, Typography, Card, CardContent, Chip, CardMedia } from '@mui/material';
import {
  AccountCircle as AccountIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';

interface UserVehicleHeaderProps {
  userName: string;
  vehicleModel: string;
  vehicleColor: string;
}

const UserVehicleHeader: React.FC<UserVehicleHeaderProps> = ({
  userName,
  vehicleModel,
  vehicleColor,
}) => {
  return (
    <Card variant="filled" sx={{ mb: 3, overflow: 'visible' }}>
      <CardContent>
        {/* Section avec image et informations côte à côte */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Image du véhicule */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              maxWidth: { xs: '100%', sm: '250px' },
            }}
          >
            <CardMedia
              component="img"
              image="https://media.volkswagen.fr/wp-content/uploads/2023/04/2d6adef8b2f3479fc4d1bb4fc0328107-2098x1399.jpg"
              alt="Volkswagen ID.3"
              sx={{
                borderRadius: '12px',
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          </Box>

          {/* Informations utilisateur et véhicule */}
          <Box sx={{ flex: 1, minWidth: '250px' }}>
            {/* Section Utilisateur */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <AccountIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Bonjour,
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {userName}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Section Véhicule */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                  }}
                >
                  <CarIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Votre véhicule préféré
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {vehicleModel}
                  </Typography>
                  <Chip
                    label={vehicleColor}
                    size="small"
                    sx={{
                      backgroundColor: 'secondary.main',
                      color: 'secondary.contrastText',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


export default UserVehicleHeader;