import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2563EB', // Electric Blue (Fintech Core)
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6366F1', // AI Indigo / Intelligence
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#06B6D4', // Cyan Analytics Glow
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Emerald 500
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Amber 500
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444', // Red 500
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F8FAFC' : '#070A13', // Ultra-clean canvas
      paper: mode === 'light' ? '#FFFFFF' : '#0F172A',   // Fintech card surface
      neutral: mode === 'light' ? '#F1F5F9' : '#1E293B',
    },
    text: {
      primary: mode === 'light' ? '#0F172A' : '#F8FAFC', // Slate 900 for high-contrast readability
      secondary: mode === 'light' ? '#475569' : '#94A3B8', // Slate 600 / 400
    },
    divider: mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.35rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.05rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.825rem',
      lineHeight: 1.55,
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.775rem',
      lineHeight: 1.55,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(15, 23, 42, 0.04)',
    '0px 1px 3px 0px rgba(15, 23, 42, 0.08), 0px 1px 2px -1px rgba(15, 23, 42, 0.06)',
    '0px 4px 6px -1px rgba(15, 23, 42, 0.08), 0px 2px 4px -2px rgba(15, 23, 42, 0.04)',
    '0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.04)',
    '0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)',
    '0px 25px 50px -12px rgba(15, 23, 42, 0.2)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '6px 14px',
          boxShadow: 'none',
          transition: 'all 0.18s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px 0 rgba(37, 99, 235, 0.28)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
            boxShadow: '0 4px 16px 0 rgba(37, 99, 235, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px 0 rgba(99, 102, 241, 0.28)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            boxShadow: '0 4px 16px 0 rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: 'none',
          border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: mode === 'light'
            ? '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.03)'
            : '0 4px 20px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(15, 23, 42, 0.6)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
            transition: 'border-color 0.15s ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow: '0px 25px 50px -12px rgba(15, 23, 42, 0.25)',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
          border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '0.72rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === 'light' ? '#F1F5F9' : 'rgba(255, 255, 255, 0.06)',
          padding: '10px 14px',
          fontSize: '0.8rem',
        },
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          backgroundColor: mode === 'light' ? '#F8FAFC' : '#1E293B',
          color: mode === 'light' ? '#475569' : '#94A3B8',
          borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          padding: '11px 14px',
        },
      },
    },
  },
});

export default createAppTheme;
