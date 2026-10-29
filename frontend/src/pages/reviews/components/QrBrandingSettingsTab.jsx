import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import { dbService } from '../../../services/dbService';
import { useAlert } from '../../../contexts/AlertContext';
import AppCard from '../../../components/AppCard';

const COLOR_PRESETS = [
  '#2563EB', // Blue
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#0F172A'  // Slate
];

const BUSINESS_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant / Cafe / Bar' },
  { value: 'SALON', label: 'Salon / Spa / Wellness' },
  { value: 'CLINIC', label: 'Clinic / Dental / Healthcare' },
  { value: 'HOTEL', label: 'Hotel / Hospitality / Resort' },
  { value: 'GYM', label: 'Gym / Fitness / Yoga Center' },
  { value: 'RETAIL', label: 'Retail Store / Supermarket' },
  { value: 'IT_SERVICES', label: 'IT Services / Technology' },
  { value: 'OTHER', label: 'Other Business / Enterprise' }
];

export const QrBrandingSettingsTab = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    businessName: '',
    businessType: 'RESTAURANT',
    logoUrl: '',
    primaryColor: '#2563EB',
    googlePlaceId: '',
    googleReviewUrl: '',
    welcomeMessage: '',
    privateFeedbackHeader: '',
    notifyEmail: '',
    notifyWhatsapp: '',
    notifyOnNegativeFeedback: true
  });

  const { data: settingsRes, isLoading } = useQuery({
    queryKey: ['qr-settings'],
    queryFn: () => dbService.getQrSettings()
  });

  useEffect(() => {
    if (settingsRes?.settings) {
      setForm({
        businessName: settingsRes.settings.businessName || '',
        businessType: settingsRes.settings.businessType || 'RESTAURANT',
        logoUrl: settingsRes.settings.logoUrl || '',
        primaryColor: settingsRes.settings.primaryColor || '#2563EB',
        googlePlaceId: settingsRes.settings.googlePlaceId || '',
        googleReviewUrl: settingsRes.settings.googleReviewUrl || '',
        welcomeMessage: settingsRes.settings.welcomeMessage || '',
        privateFeedbackHeader: settingsRes.settings.privateFeedbackHeader || '',
        notifyEmail: settingsRes.settings.notifyEmail || '',
        notifyWhatsapp: settingsRes.settings.notifyWhatsapp || '',
        notifyOnNegativeFeedback: settingsRes.settings.notifyOnNegativeFeedback ?? true
      });
    }
  }, [settingsRes]);

  const saveMutation = useMutation({
    mutationFn: (data) => dbService.updateQrSettings(data),
    onSuccess: (res) => {
      showAlert('Branding and review settings saved successfully.', 'success');
      if (res?.settings) {
        setForm(prev => ({ ...prev, googleReviewUrl: res.settings.googleReviewUrl || prev.googleReviewUrl }));
      }
      queryClient.invalidateQueries({ queryKey: ['qr-settings'] });
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to save settings.', 'error');
    }
  });

  const handlePlaceIdChange = (e) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      googlePlaceId: val,
      // Auto-compute review link if review link is empty or was previously derived
      googleReviewUrl: val ? `https://search.google.com/local/writereview?placeid=${val.trim()}` : prev.googleReviewUrl
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, gap: 3 }}>
      {/* 1. Configuration Form */}
      <AppCard title="Branding & Review Profile" subheader="Configure your public review page, Google connection, and manager alerts">
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
            <TextField
              label="Business Name *"
              placeholder="e.g. Kiaan Grill & Lounge"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              fullWidth
              size="small"
              required
            />

            <TextField
              select
              label="Business Category"
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              fullWidth
              size="small"
            >
              {BUSINESS_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Logo Image URL"
            placeholder="https://yourdomain.com/images/logo.png"
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            helperText="Paste a direct image link. Supported formats: PNG, SVG, JPG."
            fullWidth
            size="small"
          />

          {/* Color Palette Selector */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
              Primary Brand Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setForm({ ...form, primaryColor: color })}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: form.primaryColor === color ? '3px solid #0F172A' : '2px solid transparent',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.15s ease',
                    '&:hover': { transform: 'scale(1.15)' }
                  }}
                />
              ))}
              <TextField
                size="small"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                sx={{ width: 110, ml: 1 }}
              />
            </Box>
          </Box>

          {/* Google Review Integration */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#F8FAFF', borderColor: '#BFDBFE' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E40AF', mb: 1.5 }}>
              Google Business Profile Connection
            </Typography>

            <TextField
              label="Google Place ID"
              placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
              value={form.googlePlaceId}
              onChange={handlePlaceIdChange}
              helperText="Find your Place ID from Google's Place ID Finder tool."
              fullWidth
              size="small"
              sx={{ mb: 2, backgroundColor: '#FFFFFF' }}
            />

            <TextField
              label="Direct Google Review URL"
              placeholder="https://search.google.com/local/writereview?placeid=..."
              value={form.googleReviewUrl}
              onChange={(e) => setForm({ ...form, googleReviewUrl: e.target.value })}
              helperText="This official link will be opened when customers tap 'Review on Google'."
              fullWidth
              size="small"
              sx={{ backgroundColor: '#FFFFFF' }}
            />
          </Paper>

          {/* Customer Facing Texts */}
          <TextField
            label="Customer Welcome Headline"
            placeholder="Welcome! We value your honest feedback."
            value={form.welcomeMessage}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            fullWidth
            size="small"
          />

          <TextField
            label="Private Feedback Form Subheader"
            placeholder="Prefer to talk directly to management? Share your thoughts below."
            value={form.privateFeedbackHeader}
            onChange={(e) => setForm({ ...form, privateFeedbackHeader: e.target.value })}
            fullWidth
            size="small"
          />

          {/* Notification Preferences */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Manager Alert Email"
              placeholder="manager@yourbusiness.com"
              value={form.notifyEmail}
              onChange={(e) => setForm({ ...form, notifyEmail: e.target.value })}
              helperText="Receive email alerts when negative feedback (<=3★) is submitted."
              fullWidth
              size="small"
            />

            <TextField
              label="Manager Alert WhatsApp"
              placeholder="+971501234567"
              value={form.notifyWhatsapp}
              onChange={(e) => setForm({ ...form, notifyWhatsapp: e.target.value })}
              helperText="Optional phone number for instant WhatsApp complaint alerts."
              fullWidth
              size="small"
            />
          </Box>

          <Box sx={{ pt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending || !form.businessName.trim()}
              sx={{ fontWeight: 800, textTransform: 'none', px: 4 }}
            >
              {saveMutation.isPending ? 'Saving Settings...' : 'Save Branding & Settings'}
            </Button>
          </Box>
        </Box>
      </AppCard>

      {/* 2. Live Mobile Mockup Preview */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <PhoneIphoneIcon sx={{ color: '#64748B' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155' }}>
            Live Mobile Customer Preview
          </Typography>
        </Box>

        {/* Mobile Device Frame */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 320,
            borderRadius: '36px',
            border: '8px solid #0F172A',
            backgroundColor: '#F8FAFC',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            p: 2,
            minHeight: 520
          }}
        >
          {/* Mobile Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: 80, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2 }} />
          </Box>

          {/* Business Header Mockup */}
          <Paper elevation={0} sx={{ p: 2, mb: 1.5, textAlign: 'center', borderRadius: 2.5, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            {form.logoUrl ? (
              <Box component="img" src={form.logoUrl} alt="Logo" sx={{ maxHeight: 36, maxWidth: 120, mx: 'auto', mb: 1, objectFit: 'contain' }} />
            ) : (
              <Avatar sx={{ bgcolor: form.primaryColor, width: 40, height: 40, mx: 'auto', mb: 1, fontSize: '1rem', fontWeight: 700 }}>
                {form.businessName?.charAt(0) || 'B'}
              </Avatar>
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {form.businessName || 'Your Business Name'}
            </Typography>

            <Chip label="Table 1 • Downtown" size="small" sx={{ fontSize: '0.65rem', height: 18, my: 0.5, backgroundColor: '#F1F5F9' }} />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem', lineHeight: 1.3 }}>
              {form.welcomeMessage || 'We value your honest feedback! Choose how you would like to share your experience with us.'}
            </Typography>
          </Paper>

          {/* Google Review Card Mockup */}
          <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, border: '1.5px solid #4285F4', backgroundColor: '#F8FAFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <StarIcon sx={{ color: '#FBBC05', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B' }}>
                Leave a Review on Google
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: '12px !important' }} />}
              sx={{ backgroundColor: '#4285F4', color: '#FFFFFF', fontSize: '0.72rem', py: 0.6, fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
            >
              Write a Review on Google
            </Button>
          </Paper>

          {/* Private Feedback Mockup */}
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#475569' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B' }}>
                Private Feedback & Support
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', py: 0.5 }}>
              <Rating value={4} readOnly size="small" sx={{ color: '#F59E0B' }} />
            </Box>

            <Box sx={{ p: 1, backgroundColor: '#F8FAFC', borderRadius: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', fontStyle: 'italic' }}>
                Tell us what went well or what we can improve...
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="small"
              sx={{ backgroundColor: form.primaryColor, color: '#FFFFFF', fontSize: '0.72rem', py: 0.6, fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
            >
              Submit Private Feedback
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default QrBrandingSettingsTab;
