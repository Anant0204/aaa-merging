import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* Left Pane: Brand Banner (Hidden on mobile/tablet) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '55%',
          height: '100%',
          position: 'relative',
          backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: '#FFFFFF',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(7, 10, 19, 0.92) 0%, rgba(15, 23, 42, 0.85) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.75,
                flexShrink: 0,
              }}
            >
              <img
                src="/aaa-logo.png"
                alt="AAA Technologies Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.1 }}>
                AAA TECHNOLOGIES
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Cloud • Software • AI Enterprise Portal
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ zIndex: 2, mb: 4, textAlign: 'left' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.8,
              py: 0.6,
              borderRadius: '9999px',
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60A5FA',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            <span>⚡</span> Enterprise AI Systems & Digital Solutions
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 2, lineHeight: 1.2 }}>
            Your Trusted Technology Partner
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.6 }}>
            We build custom software, web and mobile applications, AI-powered solutions, and scalable cloud infrastructure to help businesses grow.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ zIndex: 2, color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
          © {new Date().getFullYear()} AAA Technologies LLC. Innovate • Build • Scale.
        </Typography>
      </Box>

      {/* Right Pane: Login Card (Spans full width on mobile) */}
      <Box
        sx={{
          width: { xs: '100%', md: '45%' },
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          py: 4,
          position: 'relative',
          overflowY: 'hidden',
          background:
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 0% 0%, #FFFFFF 0%, #EEF2F6 100%)'
              : 'radial-gradient(circle at 0% 0%, #0B1426 0%, #050A14 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 450,
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.05)',
            background:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.65)'
                : 'rgba(11, 20, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 25px 50px -12px rgba(15, 23, 42, 0.1)'
                : '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
            p: { xs: 3, sm: 3.5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          {/* Brand Header (Only visible on mobile/tablet screens) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                flexShrink: 0,
              }}
            >
              <img
                src="/aaa-logo.png"
                alt="AAA Technologies Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: theme.palette.mode === 'light' ? 'primary.main' : 'white' }}>
                AAA TECHNOLOGIES
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                IT Services & Enterprise Software Portal
              </Typography>
            </Box>
          </Box>

          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthLayout;
