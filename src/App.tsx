// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  BatteryChargingFull as BatteryIcon,
  DirectionsCar as CarIcon,
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import theme from './styles/theme';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import HomePage from './pages/HomePage';
import AddUserVehiclePage from './pages/AddUserVehiclePage';
import AddChargePage from './pages/AddChargePage';
import PreferencesPage from './pages/PreferencesPage';
import ManageUsersVehiclesPage from './pages/ManageUsersVehiclesPage';

const drawerWidth = 280;

// Menu de navigation
const navigationItems = [
  { text: 'Accueil', icon: <HomeIcon />, path: '/' },
  { text: 'Ajouter une recharge', icon: <BatteryIcon />, path: '/add-charge' },
  { text: 'Choisir la voiture', icon: <CarIcon />, path: '/preferences' },
  { text: 'Gérer utilisateurs/véhicules', icon: <SettingsIcon />, path: '/manage' },
  { text: 'Ajouter utilisateur/véhicule', icon: <PersonAddIcon />, path: '/add-user-vehicle' },
];

// Composant de navigation
const NavigationDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            EV Charging
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tableau de bord
          </Typography>
        </Box>

        <List>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: '20px',
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'secondary.main',
                      color: 'secondary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'secondary.contrastText',
                      },
                      '&:hover': {
                        backgroundColor: 'secondary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'inherit' : 'primary.main',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: isActive ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

// Composant principal de l'application
const AppContent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EV Charging Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer de navigation */}
      <NavigationDrawer open={drawerOpen} onClose={handleDrawerToggle} />

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar /> {/* Espace pour l'AppBar */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-charge" element={<AddChargePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/manage" element={<ManageUsersVehiclesPage />} />
            <Route path="/add-user-vehicle" element={<AddUserVehiclePage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <UserPreferencesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </UserPreferencesProvider>
  );
};

export default App;