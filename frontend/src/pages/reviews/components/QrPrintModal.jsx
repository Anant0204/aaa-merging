import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PrintIcon from '@mui/icons-material/Print';
import StarIcon from '@mui/icons-material/Star';

export const QrPrintModal = ({ open, onClose, qrCode, businessSettings }) => {
  if (!qrCode) return null;

  const handlePrint = () => {
    window.print();
  };

  const businessName = businessSettings?.businessName || 'Kiaan Technology';
  const logoUrl = businessSettings?.logoUrl;
  const primaryColor = businessSettings?.primaryColor || '#2563EB';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Table Tent / Counter Card Preview</span>
      </DialogTitle>
      
      <DialogContent dividers sx={{ backgroundColor: '#F8FAFC', p: 3 }}>
        {/* Printable Card Area */}
        <Box
          id="printable-tent-card"
          sx={{
            maxWidth: 360,
            mx: 'auto',
            p: 4,
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '2px solid',
            borderColor: '#E2E8F0',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            '@media print': {
              boxShadow: 'none',
              border: '1px solid #CBD5E1',
              maxWidth: '100%',
              p: 6
            }
          }}
        >
          {/* Logo or Brand Name */}
          {logoUrl ? (
            <Box
              component="img"
              src={logoUrl}
              alt={businessName}
              sx={{ maxHeight: 50, maxWidth: 160, mx: 'auto', mb: 1.5, objectFit: 'contain' }}
            />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 800, color: primaryColor, mb: 1 }}>
              {businessName}
            </Typography>
          )}

          {/* Heading */}
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A', mb: 0.5, letterSpacing: -0.5 }}>
            HOW DID WE DO?
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 24 }} />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '0.88rem' }}>
            Scan with your mobile camera to share your honest review on Google or send private feedback to management.
          </Typography>

          {/* QR Code SVG Display */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              display: 'inline-block',
              border: '1px solid #E2E8F0',
              mb: 2,
              '& svg': {
                width: 180,
                height: 180,
                display: 'block'
              }
            }}
            dangerouslySetInnerHTML={{ __html: qrCode.svgData || '' }}
          />

          {/* Location / Table Label */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155' }}>
              {qrCode.codeLabel}
            </Typography>
            {qrCode.locationName && (
              <Typography variant="caption" color="text.secondary">
                {qrCode.locationName}
              </Typography>
            )}
          </Box>

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2, fontSize: '0.7rem' }}>
            No app required • Point mobile camera to scan
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ fontWeight: 700, textTransform: 'none' }}
        >
          Print Tent Card
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrPrintModal;

