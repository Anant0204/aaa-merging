import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { motion } from 'motion/react';

export const AppCard = ({
  title,
  subheader,
  action,
  actions,
  children,
  noPadding = false,
  hoverable = false,
  sx = {},
}) => {
  const CardComponent = hoverable ? motion(Card) : Card;
  const hoverProps = hoverable
    ? {
      whileHover: { y: -3, boxShadow: '0px 12px 24px -4px rgba(15, 23, 42, 0.08)' },
      transition: { duration: 0.2 },
    }
    : {};

  return (
    <CardComponent
      {...hoverProps}
      elevation={0}
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.02)'
          : '0 4px 20px rgba(0, 0, 0, 0.25)',
        ...sx,
      }}
    >
      {(title || subheader || action) && (
        <>
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.015em' }}>
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={subheader}
            action={action}
            sx={{ px: 2.5, pt: 2, pb: 1.5 }}
          />
          <Divider sx={{ borderColor: (theme) => theme.palette.mode === 'light' ? '#F1F5F9' : 'rgba(255,255,255,0.06)' }} />
        </>
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          p: noPadding ? 0 : 2.5,
          '&:last-child': { pb: noPadding ? 0 : 2.5 }
        }}
      >
        {children}
      </CardContent>
      {actions && (
        <>
          <Divider sx={{ borderColor: (theme) => theme.palette.mode === 'light' ? '#F1F5F9' : 'rgba(255,255,255,0.06)' }} />
          <CardActions sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {actions}
          </CardActions>
        </>
      )}
    </CardComponent>
  );
};

export default AppCard;
