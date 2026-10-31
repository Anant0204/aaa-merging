import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FaceIcon from '@mui/icons-material/Face';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SecurityIcon from '@mui/icons-material/Security';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GavelIcon from '@mui/icons-material/Gavel';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';

const schema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loadingRole, setLoadingRole] = React.useState(null);

  const QUICK_ROLES = [
    { id: 'super_admin', label: 'CEO 👑', email: 'superadmin@aaaconsultancy.com' },
    { id: 'admin', label: 'Project Manager 💼', email: 'admin@aaaconsultancy.com' },
    { id: 'operations', label: 'Tech Lead / DevOps ⚙️', email: 'operations@aaaconsultancy.com' },
    { id: 'marketing', label: 'Growth / Marketing 📣', email: 'marketing@aaaconsultancy.com' },
    { id: 'consultant', label: 'Solutions Consultant 🧑‍💼', email: 'agent@aaaconsultancy.com' }
  ];

  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
    const paymentStatus = queryParams.get('payment');
    const paymentId = queryParams.get('id');

    if (paymentStatus === 'success' && paymentId) {
      const verifyPayment = async () => {
        try {
          await dbService.verifyCheckoutSession(null, paymentId);
          showAlert('Payment successfully processed & verified!', 'success');
          const cleanUrl = window.location.hash.split('?')[0];
          navigate(cleanUrl, { replace: true });
        } catch (err) {
          console.error('Payment verification failed:', err);
          showAlert('Verification failed, but your payment was processed. Please log in or contact support.', 'warning');
        }
      };
      verifyPayment();
    }
  }, [navigate, showAlert]);

  const { data: customizationSettings } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  const dynamicRoles = (customizationSettings?.rolesDefinition || [
    { id: 'admin', label: 'Admin', icon: 'SupervisorAccountIcon' },
    { id: 'operations', label: 'Operations', icon: 'SettingsSuggestIcon' },
    { id: 'finance', label: 'Finance', icon: 'AccountBalanceWalletIcon' },
    { id: 'consultant', label: 'Consultant', icon: 'SupportAgentIcon' },
    { id: 'marketing', label: 'Marketing', icon: 'CampaignIcon' }
  ]).filter(r => r.id !== 'finance');

  const getRoleIcon = (role) => {
    const iconName = role.icon || {
      'admin': 'SupervisorAccountIcon',
      'operations': 'SettingsSuggestIcon',
      'finance': 'AccountBalanceWalletIcon',
      'consultant': 'SupportAgentIcon',
      'marketing': 'CampaignIcon'
    }[role.id] || 'SupportAgentIcon';

    switch (iconName) {
      case 'SupervisorAccountIcon': return <SupervisorAccountIcon />;
      case 'SettingsSuggestIcon': return <SettingsSuggestIcon />;
      case 'AccountBalanceWalletIcon': return <AccountBalanceWalletIcon />;
      case 'CampaignIcon': return <CampaignIcon />;
      case 'FaceIcon': return <FaceIcon />;
      case 'GroupIcon': return <GroupIcon />;
      case 'StarIcon': return <StarIcon />;
      case 'VerifiedUserIcon': return <VerifiedUserIcon />;
      case 'EmojiEventsIcon': return <EmojiEventsIcon />;
      case 'AssignmentIndIcon': return <AssignmentIndIcon />;
      case 'SecurityIcon': return <SecurityIcon />;
      case 'WorkIcon': return <WorkIcon />;
      case 'BusinessCenterIcon': return <BusinessCenterIcon />;
      case 'GavelIcon': return <GavelIcon />;
      case 'AssuredWorkloadIcon': return <AssuredWorkloadIcon />;
      case 'RecordVoiceOverIcon': return <RecordVoiceOverIcon />;
      case 'LocalPoliceIcon': return <LocalPoliceIcon />;
      case 'SupportAgentIcon':
      default:
        return <SupportAgentIcon />;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '' } });

  const onSubmit = async (data) => {
    try {
      const res = await dbService.authLogin(data.email.toLowerCase().trim(), data.password);
      login(res.user, res.token);
      showAlert(`Logged in successfully as ${res.user.role}`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      const errMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : (error.response?.data?.message || 'Invalid login credentials. Please check email/password.');
      showAlert(errMsg, 'error');
    }
  };

  const handleQuickLogin = async (role) => {
    let email = 'admin@aaaconsultancy.com';
    if (role === 'super_admin') email = 'superadmin@aaaconsultancy.com';
    else if (role === 'marketing') email = 'marketing@aaaconsultancy.com';
    else if (role === 'consultant') email = 'agent@aaaconsultancy.com';
    else if (role === 'finance') email = 'finance@aaaconsultancy.com';
    else if (role === 'operations') email = 'operations@aaaconsultancy.com';

    setLoadingRole(role);
    try {
      const res = await dbService.authLogin(email, 'password123');
      if (res && res.token) {
        login(res.user, res.token);
        showAlert(`Logged in successfully as ${res.user.role}`, 'success');
        navigate('/dashboard');
        return;
      }
      showAlert('Login failed: unexpected server response.', 'error');
    } catch (err) {
      console.error('Quick login failed:', err);
      const msg = err?.response?.data?.message || 'Cannot connect to server. Please ensure the backend is running.';
      showAlert(msg, 'error');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="text"
          color="secondary"
          size="small"
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Back to Homepage
        </Button>
      </Box>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            mb: 1.5,
          }}
        >
          <img
            src="/aaa-logo.png"
            alt="AAA Technologies Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access the IT Services CRM portal.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
          <TextField
            {...register('email')}
            label="Email Address"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>

          {/* Quick Demo Role Access */}
          <Divider sx={{ my: 1.5, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
            QUICK ROLE ACCESS (DEMO)
          </Divider>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {QUICK_ROLES.map((r) => {
              const isLoading = loadingRole === r.id;
              return (
                <Chip
                  key={r.id}
                  label={isLoading ? 'Logging in...' : r.label}
                  onClick={() => !loadingRole && handleQuickLogin(r.id)}
                  clickable={!loadingRole}
                  disabled={loadingRole !== null && !isLoading}
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    py: 2,
                    px: 0.5,
                    borderRadius: '16px',
                    cursor: loadingRole ? 'not-allowed' : 'pointer',
                    borderColor: 'secondary.main',
                    color: 'text.primary',
                    bgcolor: isLoading ? 'secondary.light' : 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'secondary.main',
                      color: '#ffffff',
                      borderColor: 'secondary.main',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
