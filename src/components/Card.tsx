// src/components/Card.tsx
import React, { ReactNode } from 'react';
import { globalStyles } from '../styles/GlobalStyle';

interface CardProps {
  children: ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div style={globalStyles.card}>
      {title && <h3 style={{ marginTop: 0, color: '#fff' }}>{title}</h3>}
      {children}
    </div>
  );
};
