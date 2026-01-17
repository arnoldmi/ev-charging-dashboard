// src/components/MD3Components.tsx
import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

// ========================================
// STAT CARD - Carte de statistique MD3
// ========================================
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  color?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  unit,
  subtitle,
  color,
  variant = 'elevated',
  onClick,
  sx,
}) => {
  const theme = useTheme();

  return (
    <MuiCard
      variant={variant}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[3],
        } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: color || 'primary.main',
              color: 'primary.contrastText',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          {value}
          {unit && (
            <Typography
              component="span"
              variant="h6"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              {unit}
            </Typography>
          )}
        </Typography>
      </CardContent>
    </MuiCard>
  );
};

// ========================================
// INFO CARD - Carte d'information MD3
// ========================================
interface InfoCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  avatar?: string;
  chips?: Array<{ label: string; color?: string }>;
  actions?: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  avatar,
  chips,
  actions,
  variant = 'outlined',
  children,
  sx,
}) => {
  return (
    <MuiCard variant={variant} sx={{ ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          {(icon || avatar) && (
            <Box sx={{ mr: 2 }}>
              {avatar ? (
                <Avatar src={avatar} sx={{ width: 48, height: 48 }} />
              ) : (
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
                  {icon}
                </Box>
              )}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Box>

        {chips && chips.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={chip.label}
                size="small"
                sx={{
                  backgroundColor: chip.color || 'secondary.main',
                  color: 'secondary.contrastText',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        {children}
      </CardContent>
    </MuiCard>
  );
};

// ========================================
// SECTION HEADER - En-tête de section MD3
// ========================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  divider?: boolean;
  sx?: SxProps<Theme>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  divider = false,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        pb: divider ? 2 : 0,
        borderBottom: divider ? '1px solid' : 'none',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

// ========================================
// METRIC DISPLAY - Affichage de métrique
// ========================================
interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  sx?: SxProps<Theme>;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  unit,
  trend,
  trendValue,
  size = 'medium',
  color,
  sx,
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: { value: 'h6', label: 'caption' },
    medium: { value: 'h4', label: 'body2' },
    large: { value: 'h2', label: 'h6' },
  };

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.text.secondary,
  };

  return (
    <Box sx={{ ...sx }}>
      <Typography
        variant={sizeMap[size].label as any}
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography
          variant={sizeMap[size].value as any}
          sx={{
            fontWeight: 500,
            color: color || 'text.primary',
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography variant="body1" color="text.secondary">
            {unit}
          </Typography>
        )}
      </Box>
      {trend && trendValue && (
        <Typography
          variant="caption"
          sx={{
            color: trendColors[trend],
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </Typography>
      )}
    </Box>
  );
};

// ========================================
// LOADING CARD - Carte de chargement
// ========================================
interface LoadingCardProps {
  text?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  sx?: SxProps<Theme>;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  text = 'Chargement...',
  variant = 'elevated',
  sx,
}) => {
  return (
    <MuiCard variant={variant} sx={{ ...sx }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid',
              borderColor: 'primary.main',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              mb: 2,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </Box>
      </CardContent>
    </MuiCard>
  );
};

// ========================================
// EMPTY STATE - État vide
// ========================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  sx?: SxProps<Theme>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'outlined',
  sx,
}) => {
  return (
    <MuiCard variant={variant} sx={{ ...sx }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            px: 2,
          }}
        >
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'action.hover',
                color: 'text.secondary',
                mb: 3,
                fontSize: 40,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, mb: 1, textAlign: 'center' }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3, maxWidth: '400px' }}
            >
              {description}
            </Typography>
          )}
          {action && <Box>{action}</Box>}
        </Box>
      </CardContent>
    </MuiCard>
  );
};

// ========================================
// Export de tous les composants
// ========================================
export default {
  StatCard,
  InfoCard,
  SectionHeader,
  MetricDisplay,
  LoadingCard,
  EmptyState,
};