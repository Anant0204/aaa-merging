import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import { dbService } from '../../services/dbService';

const CATEGORIES = [
  'Food & Quality',
  'Service & Staff',
  'Cleanliness',
  'Wait Time',
  'Ambience',
  'Billing'
];

export const PublicReviewLanding = () => {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);

  // Private Feedback Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    dbService.resolvePublicQr(slug)
      .then((res) => {
        if (isMounted) {
          if (res && res.success) {
            setQrData(res);
          } else {
            setError(res?.message || 'Unable to load review page.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'QR Code not found or has been deactivated.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  const handleGoogleClick = () => {
    if (!qrData?.business?.googleReviewUrl) return;

    // Track intent telemetry
    const isMobile = window.innerWidth <= 768;
    dbService.trackPublicQrClick(slug, isMobile ? 'mobile' : 'desktop').catch(() => {});

    // Open official Google Review form
    window.open(qrData.business.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setSubmitError('Please select a star rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const isEmail = customerContact.includes('@');
      await dbService.submitPublicFeedback({
        slug,
        rating,
        feedbackCategory: selectedCategory || 'General',
        feedbackText: feedbackText.trim(),
        customerName: customerName.trim(),
        customerEmail: isEmail ? customerContact.trim() : '',
        customerPhone: !isEmail ? customerContact.trim() : '',
        user_website: honeypot // Anti-bot honeypot
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', p: 3 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error || !qrData) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', p: 2 }}>
        <Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: '#E2E8F0' }}>
          <StorefrontIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
            Review Page Unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error || 'This QR code could not be verified or is temporarily deactivated.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const { business, qrCode } = qrData;
  const brandColor = business.primaryColor || '#2563EB';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', py: { xs: 2.5, sm: 5 }, px: 2 }}>
      <Box sx={{ maxWidth: 480, mx: 'auto' }}>
        
        {/* 1. Header Card with Branding */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2.5,
            borderRadius: 3.5,
            textAlign: 'center',
            border: '1px solid',
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}
        >
          {business.logoUrl ? (
            <Box
              component="img"
              src={business.logoUrl}
              alt={business.businessName}
              sx={{ maxHeight: 60, maxWidth: 180, mx: 'auto', mb: 1.5, objectFit: 'contain' }}
            />
          ) : (
            <Avatar
              sx={{
                bgcolor: brandColor,
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 1.5,
                fontSize: '1.4rem',
                fontWeight: 700
              }}
            >
              {business.businessName?.charAt(0) || 'K'}
            </Avatar>
          )}

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            {business.businessName}
          </Typography>

          {qrCode?.codeLabel && (
            <Chip
              label={qrCode.locationName ? `${qrCode.codeLabel} • ${qrCode.locationName}` : qrCode.codeLabel}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                mb: 1.5
              }}
            />
          )}

          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
            {business.welcomeMessage || 'We value your honest feedback! Choose how you would like to share your experience with us.'}
          </Typography>
        </Paper>

        {/* 2. OPTION A: Google Review Card (Equal Visibility, Primary Action) */}
        {business.googleReviewUrl && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 3,
              border: '1.5px solid #4285F4',
              backgroundColor: '#F8FAFF',
              boxShadow: '0 4px 14px rgba(66, 133, 244, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <StarIcon sx={{ color: '#FBBC05', fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
                  Leave a Review on Google
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Opens Google's official review form directly
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mb: 2 }}>
              Share your honest rating and thoughts publicly to help others discover our service.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<OpenInNewIcon />}
              onClick={handleGoogleClick}
              sx={{
                backgroundColor: '#4285F4',
                color: '#FFFFFF',
                fontWeight: 700,
                textTransform: 'none',
                py: 1.3,
                borderRadius: 2.5,
                fontSize: '0.95rem',
                boxShadow: '0 4px 10px rgba(66, 133, 244, 0.25)',
                '&:hover': {
                  backgroundColor: '#3367D6'
                }
              }}
            >
              Write a Review on Google
            </Button>
          </Paper>
        )}

        {/* 3. OPTION B: Private Feedback / Report an Issue (Simultaneously Visible) */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChatBubbleOutlineIcon sx={{ color: '#475569', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
                Private Feedback & Support
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sent directly to management for immediate resolution
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {submitted ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 52, color: '#10B981', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                Thank You for Your Feedback!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                Your response has been delivered directly to our management team. We appreciate you helping us provide a better experience.
              </Typography>
              {business.googleReviewUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleGoogleClick}
                  endIcon={<OpenInNewIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#CBD5E1' }}
                >
                  Also leave a public review on Google
                </Button>
              )}
            </Box>
          ) : (
            <Box component="form" onSubmit={handleFeedbackSubmit}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2, fontSize: '0.82rem' }}>
                  {submitError}
                </Alert>
              )}

              {/* Star Rating */}
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
                  How would you rate your overall experience?
                </Typography>
                <Rating
                  name="feedback-rating"
                  value={rating}
                  size="large"
                  precision={1}
                  onChange={(event, newValue) => setRating(newValue || 0)}
                  onChangeActive={(event, newHover) => setHoverRating(newHover)}
                  sx={{
                    fontSize: '2.5rem',
                    color: '#F59E0B',
                    '& .MuiRating-iconEmpty': { color: '#CBD5E1' }
                  }}
                />
                <Box sx={{ height: 20, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                    {hoverRating !== -1
                      ? ['', 'Poor', 'Fair', 'Average', 'Good', 'Excellent'][hoverRating]
                      : ['', 'Poor', 'Fair', 'Average', 'Good', 'Excellent'][rating] || 'Tap a star to rate'}
                  </Typography>
                </Box>
              </Box>

              {/* Category Pills */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                What did this involve? (Optional)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    size="small"
                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderColor: selectedCategory === cat ? brandColor : '#E2E8F0',
                      backgroundColor: selectedCategory === cat ? '#EFF6FF' : '#FFFFFF',
                      color: selectedCategory === cat ? brandColor : '#475569',
                      '&:hover': { backgroundColor: '#F8FAFC' }
                    }}
                    variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>

              {/* Feedback Textarea */}
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share any comments, compliments, or issues you experienced..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
              />

              {/* Optional Contact Inputs */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Contact details (Optional — if you'd like our manager to follow up with you):
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                  <TextField
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    placeholder="Phone or Email (Optional)"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    size="small"
                  />
                </Box>
              </Box>

              {/* Hidden Anti-Bot Honeypot */}
              <input
                type="text"
                name="user_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting || rating === 0}
                sx={{
                  backgroundColor: brandColor,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1.2,
                  borderRadius: 2.5,
                  fontSize: '0.95rem',
                  '&:hover': { backgroundColor: brandColor, opacity: 0.9 }
                }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Private Feedback'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Footer */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3, fontSize: '0.75rem' }}>
          Powered by Kiaan Smart Reputation Management
        </Typography>
      </Box>
    </Box>
  );
};

export default PublicReviewLanding;
