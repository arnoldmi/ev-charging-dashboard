// src/providers/ThemeProvider.tsx
import React, { ReactNode } from 'react';
import { darkTheme } from '../styles/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div style={{
      backgroundColor: darkTheme.colors.background,
      color: darkTheme.colors.text,
      fontFamily: darkTheme.fonts.main,
      minHeight: '100vh',
      padding: darkTheme.spacing.md,
    }}>
      {children}
    </div>
  );
};
