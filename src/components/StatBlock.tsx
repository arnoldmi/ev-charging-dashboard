// src/components/StatBlock.tsx
import React, { ReactNode } from 'react';
import { darkTheme } from '../styles/theme';

interface StatBlockProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({ icon, label, value, color = darkTheme.colors.primary }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: darkTheme.spacing.md }}>
      <div style={{ color, fontSize: '24px', marginRight: darkTheme.spacing.md }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: darkTheme.colors.textSecondary, fontSize: '14px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '20px', color: darkTheme.colors.text }}>{value}</p>
      </div>
    </div>
  );
};
