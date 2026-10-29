import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

export const IT_PIPELINE_STAGES = [
  { id: 'new_inquiry', name: 'New Inquiry', aliases: ['new lead', 'new inquiry', 'new', 'form submitted'], color: '#2563EB', emoji: '🆕', desc: 'Initial lead captured via form or referral' },
  { id: 'discovery_scheduled', name: 'Discovery Scheduled', aliases: ['discovery scheduled', 'meeting scheduled', 'contacted'], color: '#4F46E5', emoji: '📅', desc: 'Discovery call or intro consultation booked' },
  { id: 'requirement_analysis', name: 'Requirement Analysis', aliases: ['requirement analysis', 'scoping', 'technical scoping', 'meeting completed'], color: '#0891B2', emoji: '🔍', desc: 'Architecture, tech stack & scope evaluation' },
  { id: 'proposal_sent', name: 'Proposal Sent', aliases: ['proposal sent', 'proposal / sow sent', 'quote sent'], color: '#9333EA', emoji: '📑', desc: 'Detailed technical proposal & SOW dispatched' },
  { id: 'negotiation', name: 'Negotiation', aliases: ['negotiation', 'in negotiation', 'under review'], color: '#D97706', emoji: '🤝', desc: 'Pricing, milestone & contract terms negotiation' },
  { id: 'deal_won', name: 'Deal Won', aliases: ['deal won', 'won', 'completed', 'active client'], color: '#059669', emoji: '🏆', desc: 'Contract signed, deposit paid & onboarded' },
  { id: 'deal_lost', name: 'Deal Lost', aliases: ['deal lost', 'lost', 'closed', 'lost lead', 'cancelled'], color: '#DC2626', emoji: '❌', desc: 'Inquiry dropped, disqualified or cancelled' }
];

export const getStageIndex = (statusStr = '') => {
  const s = String(statusStr || '').toLowerCase().trim();
  const idx = IT_PIPELINE_STAGES.findIndex(st => 
    st.name.toLowerCase() === s || st.aliases.some(a => a === s || s.includes(a))
  );
  return idx >= 0 ? idx : 0;
};

export const SalesPipelineStepper = ({
  currentStatus = 'New Inquiry',
  onStageClick,
  readOnly = false,
  sx = {}
}) => {
  const currentIdx = getStageIndex(currentStatus);
  const isLost = currentStatus && (
    currentStatus.toLowerCase().includes('lost') || 
    currentStatus.toLowerCase().includes('cancel') ||
    currentStatus.toLowerCase().includes('closed')
  );
  const isWon = currentStatus && (
    currentStatus.toLowerCase().includes('won') || 
    currentStatus.toLowerCase() === 'completed'
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        ...sx
      }}
    >
      {/* Header Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>
            💼 IT Sales Pipeline
          </Typography>
          <Chip
            size="small"
            label={`Current: ${currentStatus}`}
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              bgcolor: isLost ? 'rgba(239,68,68,0.1)' : isWon ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)',
              color: isLost ? '#DC2626' : isWon ? '#059669' : '#4F46E5',
              border: '1px solid',
              borderColor: isLost ? 'rgba(239,68,68,0.3)' : isWon ? 'rgba(16,185,129,0.3)' : 'rgba(79,70,229,0.3)'
            }}
          />
        </Box>

        {!readOnly && onStageClick && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.75rem' }}>
            💡 Click any stage below to advance pipeline
          </Typography>
        )}
      </Box>

      {/* Stepper Track */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          py: 1,
          px: 0.5,
          position: 'relative',
          gap: { xs: 1, sm: 1.5 },
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
        }}
      >
        {IT_PIPELINE_STAGES.map((stage, idx) => {
          const isCurrent = idx === currentIdx;
          const isPassed = !isLost && idx < currentIdx;
          const isDealLostStage = stage.id === 'deal_lost';
          const isDealWonStage = stage.id === 'deal_won';

          // Visual state determination
          let nodeBg = '#F1F5F9';
          let nodeColor = '#64748B';
          let nodeBorder = '1px solid #CBD5E1';

          if (isCurrent) {
            nodeBg = stage.color;
            nodeColor = '#FFFFFF';
            nodeBorder = `2px solid ${stage.color}`;
          } else if (isPassed) {
            nodeBg = '#E0F2FE';
            nodeColor = '#0369A1';
            nodeBorder = '1px solid #7DD3FC';
          } else if (isLost && isDealLostStage) {
            nodeBg = '#FEE2E2';
            nodeColor = '#DC2626';
            nodeBorder = '2px solid #DC2626';
          } else if (isWon && isDealWonStage) {
            nodeBg = '#DCFCE7';
            nodeColor = '#059669';
            nodeBorder = '2px solid #059669';
          }

          const isClickable = !readOnly && Boolean(onStageClick);

          return (
            <Tooltip key={stage.id} title={stage.desc} arrow>
              <Box
                onClick={() => {
                  if (isClickable && !isCurrent) {
                    onStageClick(stage.name);
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: { xs: 80, sm: 105 },
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  opacity: (isLost && !isDealLostStage && !isCurrent) ? 0.6 : 1,
                  '&:hover': isClickable ? {
                    transform: 'translateY(-2px)'
                  } : {}
                }}
              >
                {/* Node Circle */}
                <Box
                  sx={{
                    width: { xs: 34, sm: 40 },
                    height: { xs: 34, sm: 40 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: nodeBg,
                    color: nodeColor,
                    border: nodeBorder,
                    boxShadow: isCurrent ? `0 0 10px ${stage.color}60` : 'none',
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', sm: '0.95rem' },
                    mb: 0.75,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCurrent ? (
                    <RadioButtonCheckedIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  ) : isPassed ? (
                    <CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  ) : isLost && isDealLostStage ? (
                    <CancelIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  ) : (
                    <span>{stage.emoji}</span>
                  )}
                </Box>

                {/* Stage Name */}
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? stage.color : 'text.primary',
                    fontSize: { xs: '0.68rem', sm: '0.75rem' },
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {stage.name}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SalesPipelineStepper;

