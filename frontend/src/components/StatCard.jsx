import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'up',
  color = '#2563EB',
  onClick,
  trendLabel,
  sx = {},
}) => {
  const isUp = trendDirection === 'up';

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: { xs: 1.75, sm: 2.25 },
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '14px',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          borderColor: color,
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? `0 10px 25px -5px ${color}20, 0 8px 10px -6px ${color}10`
            : `0 10px 25px -5px rgba(0,0,0,0.5)`,
        } : {},
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0, flex: 1, pr: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: { xs: '0.65rem', sm: '0.72rem' },
            color: 'text.secondary',
            display: 'block',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.4rem', sm: '1.75rem' },
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: 'text.primary',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.3,
                px: 0.9,
                py: 0.2,
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: { xs: '0.65rem', sm: '0.72rem' },
                bgcolor: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isUp ? '#10B981' : '#EF4444',
              }}
            >
              {isUp ? <ArrowUpwardIcon sx={{ fontSize: '0.85rem' }} /> : <ArrowDownwardIcon sx={{ fontSize: '0.85rem' }} />}
              {trend}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.62rem', sm: '0.7rem' }, fontWeight: 500 }}
            >
              {trendLabel || 'vs last period'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modern Fintech Icon Badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          borderRadius: '12px',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
          border: '1px solid',
          borderColor: `${color}30`,
          color: color,
          boxShadow: `0 4px 12px ${color}15`,
          '& svg': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

export default StatCard;
