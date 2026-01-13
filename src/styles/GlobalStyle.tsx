// src/styles/GlobalStyle.tsx
import { darkTheme } from './theme';

export const globalStyles = {
  card: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  button: {
    primary: {
      backgroundColor: darkTheme.colors.primary,
      color: darkTheme.colors.background,
      border: 'none',
      padding: `${darkTheme.spacing.sm} ${darkTheme.spacing.md}`,
      borderRadius: darkTheme.borderRadius.sm,
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    secondary: {
      backgroundColor: darkTheme.colors.secondary,
      color: darkTheme.colors.background,
      border: 'none',
      padding: `${darkTheme.spacing.sm} ${darkTheme.spacing.md}`,
      borderRadius: darkTheme.borderRadius.sm,
      cursor: 'pointer',
    },
  },
  typography: {
    h1: {
      color: darkTheme.colors.primary,
      fontFamily: darkTheme.fonts.title,
      fontSize: '24px',
      marginBottom: darkTheme.spacing.md,
    },
    h2: {
      color: darkTheme.colors.text,
      fontFamily: darkTheme.fonts.title,
      fontSize: '20px',
      marginBottom: darkTheme.spacing.sm,
    },
    body: {
      color: darkTheme.colors.textSecondary,
      fontSize: '14px',
      lineHeight: '1.5',
    },
  },
};
