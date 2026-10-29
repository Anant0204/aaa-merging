import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import dayjs from 'dayjs';

export const DealCommercialsCard = ({ lead = {}, serviceName = '' }) => {
  const companyName = lead.qualificationData?.companyName || lead.companyName;
  const itService = serviceName || lead.serviceType || lead.serviceId || 'Custom Software Development';
  const budgetRange = lead.budget || lead.qualificationData?.budget || 'Not specified';
  const dealValue = lead.qualificationData?.dealValue;
  const targetTimeline = lead.qualificationData?.targetTimeline || 'Standard (1-3 months)';
  const techBrief = lead.meetingNotes || lead.qualificationData?.projectScope || lead.notes;
  const currentStatus = lead.status || 'New Inquiry';

  // Proposal stage resolution
  const isProposalSent = currentStatus.toLowerCase().includes('proposal') || 
                         currentStatus.toLowerCase().includes('negotiat') || 
                         currentStatus.toLowerCase().includes('won');
  
  const isDealWon = currentStatus.toLowerCase().includes('won') || currentStatus.toLowerCase() === 'completed';

  const proposalDocs = (lead.documents || []).filter(d => {
    const name = String(d.name || d.documentName || '').toLowerCase();
    return name.includes('proposal') || name.includes('sow') || name.includes('scope') || name.includes('contract');
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        mb: 3
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
            💼 IT Deal & Commercials Overview
          </Typography>
          {companyName && (
            <Chip
              icon={<BusinessIcon sx={{ fontSize: '14px !important' }} />}
              label={companyName}
              size="small"
              sx={{ fontWeight: 700, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4F46E5' }}
            />
          )}
        </Box>
        <Chip
          label={isDealWon ? '🏆 Deal Closed / Won' : isProposalSent ? '📑 Proposal Dispatched' : '⏳ Discovery & Scoping Phase'}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: isDealWon ? 'rgba(16,185,129,0.1)' : isProposalSent ? 'rgba(147,51,234,0.1)' : 'rgba(59,130,246,0.1)',
            color: isDealWon ? '#059669' : isProposalSent ? '#9333EA' : '#2563EB'
          }}
        />
      </Box>

      {/* Grid of Key Commercial Fields */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* Company Name */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ bgcolor: 'rgba(248, 250, 252, 0.8)', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
              <BusinessIcon sx={{ fontSize: 14, color: '#64748B' }} /> Company / Client Organization
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
              {companyName || 'Individual / Startup Founder'}
            </Typography>
          </Box>
        </Grid>

        {/* Required IT Service */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ bgcolor: 'rgba(248, 250, 252, 0.8)', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
              <CodeIcon sx={{ fontSize: 14, color: '#64748B' }} /> IT Service / Project Domain
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
              {itService}
            </Typography>
          </Box>
        </Grid>

        {/* Target Timeline */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ bgcolor: 'rgba(248, 250, 252, 0.8)', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: '#64748B' }} /> Target Delivery Timeline
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
              {targetTimeline}
            </Typography>
          </Box>
        </Grid>

        {/* Estimated Budget Range (Client Inquiry) */}
        <Grid item xs={12} sm={6} md={6}>
          <Box sx={{ bgcolor: '#F0FDF4', p: 1.5, borderRadius: 2, border: '1px solid #BBF7D0' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, color: '#166534' }}>
              <MonetizationOnIcon sx={{ fontSize: 14, color: '#166534' }} /> Estimated Budget Range (Client Indicated)
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#15803D', mt: 0.5 }}>
              {budgetRange}
            </Typography>
            <Typography variant="caption" sx={{ color: '#166534', fontStyle: 'italic', display: 'block', mt: 0.25 }}>
              *Subject to technical requirement analysis and formal scope
            </Typography>
          </Box>
        </Grid>

        {/* Confirmed Deal Value (Contract / SOW) */}
        <Grid item xs={12} sm={6} md={6}>
          <Box sx={{ bgcolor: dealValue ? '#EFF6FF' : '#F8FAFC', p: 1.5, borderRadius: 2, border: dealValue ? '1px solid #BFDBFE' : '1px dashed #CBD5E1' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, color: dealValue ? '#1E40AF' : '#64748B' }}>
              <MonetizationOnIcon sx={{ fontSize: 14, color: dealValue ? '#1E40AF' : '#64748B' }} /> Confirmed Deal Value (SOW Contract)
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: dealValue ? '#1D4ED8' : '#64748B', mt: 0.5 }}>
              {dealValue ? `$${Number(dealValue).toLocaleString()} USD` : 'Pending Proposal / SOW Confirmation'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic', display: 'block', mt: 0.25 }}>
              {dealValue ? '✅ Formally locked in commercial contract' : 'ℹ️ Locked upon proposal acceptance and contract signing'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Technical Requirements / Project Brief */}
      {techBrief && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <DescriptionIcon sx={{ fontSize: 16, color: '#64748B' }} /> Technical Brief & Project Requirements
          </Typography>
          <Typography variant="body2" sx={{ color: '#1E293B', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.875rem' }}>
            {techBrief}
          </Typography>
        </Box>
      )}

      {/* Proposal & SOW Status Section */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          📑 IT Proposal & SOW Documentation
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <InfoOutlinedIcon sx={{ fontSize: 14 }} /> Backend SOW generator integration status: <strong style={{ color: '#6366F1' }}>Phase 3</strong>
        </Typography>
      </Box>

      {proposalDocs.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 1.5 }}>
          {proposalDocs.map((doc, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#4F46E5', fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    {doc.name || doc.documentName || 'Project_Proposal_SOW.pdf'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.size || '1.2 MB'} • Uploaded {dayjs(doc.createdAt || doc.uploadedAt || new Date()).format('DD/MM/YYYY')}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                {doc.url && (
                  <>
                    <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} href={doc.url} target="_blank" rel="noopener noreferrer">
                      View
                    </Button>
                    <Button size="small" variant="contained" startIcon={<DownloadIcon />} href={doc.url} download target="_blank" rel="noopener noreferrer">
                      Download
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 2, border: '1px dashed #CBD5E1', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            No formal proposal or SOW uploaded yet.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Advance the pipeline to <strong>"Proposal Sent"</strong> and attach your technical proposal PDF to dispatch to the client.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DealCommercialsCard;
