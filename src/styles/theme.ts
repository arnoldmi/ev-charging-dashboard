// src/styles/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Déclaration des types TypeScript pour étendre la palette MUI
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

// Déclaration pour les variantes de boutons personnalisées
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    tonal: true;
  }
}

// Déclaration pour les variantes de Paper (utilisé par Card)
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    elevated: true;
    filled: true;
  }
}

// Déclaration pour les variantes de cartes personnalisées
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    elevated: true;
    filled: true;
  }
}

// Tokens de couleurs Material Design 3
const md3ColorTokens = {
  // Primary (Violet - couleur principale)
  primary: {
    main: '#D0BCFF',      // Primary40
    light: '#EADDFF',     // Primary80
    dark: '#9A82DB',      // Primary30
    contrastText: '#381E72', // On Primary
  },
  // Secondary (Turquoise)
  secondary: {
    main: '#CCC2DC',      // Secondary40
    light: '#E8DEF8',     // Secondary80
    dark: '#B0A7C0',      // Secondary30
    contrastText: '#332D41', // On Secondary
  },
  // Tertiary (Rose/Mauve)
  tertiary: {
    main: '#EFB8C8',      // Tertiary40
    light: '#FFD8E4',     // Tertiary80
    dark: '#D29DAC',      // Tertiary30
    contrastText: '#492532', // On Tertiary
  },
  // Error
  error: {
    main: '#F2B8B5',      // Error40
    light: '#F9DEDC',     // Error80
    dark: '#CF6679',      // Error30
    contrastText: '#601410', // On Error
  },
  // Surface & Background
  surface: {
    dim: '#141218',
    default: '#1C1B1F',
    bright: '#3B383E',
    containerLowest: '#0F0D13',
    containerLow: '#1C1B1F',
    container: '#201F26',
    containerHigh: '#2B2930',
    containerHighest: '#36343B',
  },
  // Outline
  outline: {
    default: '#938F99',
    variant: '#49454F',
  },
};

// Configuration du thème Material Design 3
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: md3ColorTokens.primary,
    secondary: md3ColorTokens.secondary,
    tertiary: md3ColorTokens.tertiary,
    error: md3ColorTokens.error,
    background: {
      default: md3ColorTokens.surface.default,
      paper: md3ColorTokens.surface.container,
    },
    text: {
      primary: '#E6E1E5',      // On Surface
      secondary: '#CAC4D0',    // On Surface Variant
      disabled: '#938F99',
    },
    divider: md3ColorTokens.outline.variant,
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB74D',
      light: '#FFD54F',
      dark: '#F57C00',
      contrastText: '#000000',
    },
    info: {
      main: '#64B5F6',
      light: '#90CAF9',
      dark: '#42A5F5',
      contrastText: '#000000',
    },
  },

  // Typography Material Design 3
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    
    // Display - pour les grandes annonces
    h1: {
      fontSize: '57px',
      fontWeight: 400,
      lineHeight: '64px',
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '45px',
      fontWeight: 400,
      lineHeight: '52px',
      letterSpacing: '0px',
    },
    
    // Headline - pour les titres de section
    h3: {
      fontSize: '32px',
      fontWeight: 400,
      lineHeight: '40px',
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '28px',
      fontWeight: 400,
      lineHeight: '36px',
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: '32px',
      letterSpacing: '0px',
    },
    
    // Title - pour les titres moyens
    h6: {
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: '28px',
      letterSpacing: '0px',
    },
    
    // Body - pour le texte principal
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.25px',
    },
    
    // Label - pour les boutons et labels
    button: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      letterSpacing: '0.1px',
      textTransform: 'none', // MD3 n'utilise pas de majuscules automatiques
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '11px',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },

  // Shape - Formes Material Design 3
  shape: {
    borderRadius: 12, // MD3 utilise des coins plus arrondis
  },

  // Spacing
  spacing: 8, // Base de 8px

  // Components - Personnalisation des composants
  components: {
    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: md3ColorTokens.surface.container,
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${md3ColorTokens.outline.variant}`,
        },
      },
    },

    // Button - Style Material Design 3
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Filled button shape
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0.1px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: md3ColorTokens.primary.main,
          color: md3ColorTokens.primary.contrastText,
          '&:hover': {
            backgroundColor: md3ColorTokens.primary.dark,
          },
        },
        outlined: {
          borderColor: md3ColorTokens.outline.default,
          color: md3ColorTokens.primary.main,
          '&:hover': {
            backgroundColor: `${md3ColorTokens.primary.main}14`, // 8% opacity
            borderColor: md3ColorTokens.outline.default,
          },
        },
        text: {
          color: md3ColorTokens.primary.main,
          '&:hover': {
            backgroundColor: `${md3ColorTokens.primary.main}14`,
          },
        },
      },
      variants: [
        {
          props: { variant: 'elevated' },
          style: {
            backgroundColor: md3ColorTokens.surface.containerLow,
            color: md3ColorTokens.primary.main,
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              backgroundColor: md3ColorTokens.surface.containerHigh,
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
            },
          },
        },
        {
          props: { variant: 'tonal' },
          style: {
            backgroundColor: md3ColorTokens.secondary.main,
            color: md3ColorTokens.secondary.contrastText,
            '&:hover': {
              backgroundColor: md3ColorTokens.secondary.dark,
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      ],
    },

    // Card - Style Material Design 3
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: md3ColorTokens.surface.containerLow,
          backgroundImage: 'none',
          boxShadow: 'none',
          border: `1px solid ${md3ColorTokens.outline.variant}`,
        },
      },
      variants: [
        {
          props: { variant: 'elevated' },
          style: {
            border: 'none',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
        {
          props: { variant: 'filled' },
          style: {
            backgroundColor: md3ColorTokens.surface.containerHighest,
            border: 'none',
          },
        },
      ],
    },

    // TextField - Style Material Design 3
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px', // Top corners only in MD3
            '& fieldset': {
              borderColor: md3ColorTokens.outline.default,
            },
            '&:hover fieldset': {
              borderColor: md3ColorTokens.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: md3ColorTokens.primary.main,
              borderWidth: '2px',
            },
          },
        },
      },
    },

    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: '32px',
        },
        filled: {
          backgroundColor: md3ColorTokens.secondary.main,
          color: md3ColorTokens.secondary.contrastText,
        },
        outlined: {
          borderColor: md3ColorTokens.outline.default,
        },
      },
    },

    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '28px', // MD3 large corner radius
          backgroundColor: md3ColorTokens.surface.containerHigh,
        },
      },
    },

    // Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: md3ColorTokens.surface.container,
          borderRight: `1px solid ${md3ColorTokens.outline.variant}`,
        },
      },
    },

    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
        elevation3: {
          boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },

    // Switch
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
        },
        switchBase: {
          padding: 8,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: md3ColorTokens.primary.contrastText,
            '& + .MuiSwitch-track': {
              backgroundColor: md3ColorTokens.primary.main,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 16,
          height: 16,
        },
        track: {
          borderRadius: 16,
          backgroundColor: md3ColorTokens.surface.containerHighest,
          opacity: 1,
        },
      },
    },

    // Fab (Floating Action Button)
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  },
});

export default theme;

// Export des tokens pour utilisation dans les composants personnalisés
export { md3ColorTokens };