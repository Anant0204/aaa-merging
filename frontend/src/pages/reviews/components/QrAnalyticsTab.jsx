import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { dbService } from '../../../services/dbService';
import StatCard from '../../../components/StatCard';
import AppCard from '../../../components/AppCard';

const SENTIMENT_COLORS = {
  POSITIVE: '#10B981',
  NEUTRAL: '#64748B',
  NEGATIVE: '#EF4444'
};

export const QrAnalyticsTab = () => {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['qr-analytics'],
    queryFn: () => dbService.getQrAnalyticsSummary(),
    refetchInterval: 15000 // Refresh every 15s
  });

  const summary = analyticsRes?.summary || {
    totalScans: 0,
    totalGoogleClicks: 0,
    totalFeedbacks: 0,
    conversionRate: 0,
    averagePrivateRating: 0.0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    sentimentBreakdown: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 },
    complaintsSummary: { total: 0, open: 0, inProgress: 0, resolved: 0 },
    activeQrCount: 0,
    topQrCodes: []
  };

  const ratingChartData = [
    { stars: '5 Stars', count: summary.ratingDistribution[5] || 0 },
    { stars: '4 Stars', count: summary.ratingDistribution[4] || 0 },
    { stars: '3 Stars', count: summary.ratingDistribution[3] || 0 },
    { stars: '2 Stars', count: summary.ratingDistribution[2] || 0 },
    { stars: '1 Star', count: summary.ratingDistribution[1] || 0 }
  ];

  const sentimentPieData = [
    { name: 'Positive', value: summary.sentimentBreakdown.POSITIVE || 0, color: SENTIMENT_COLORS.POSITIVE },
    { name: 'Neutral', value: summary.sentimentBreakdown.NEUTRAL || 0, color: SENTIMENT_COLORS.NEUTRAL },
    { name: 'Negative', value: summary.sentimentBreakdown.NEGATIVE || 0, color: SENTIMENT_COLORS.NEGATIVE }
  ].filter(d => d.value > 0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box>
      {/* 1. Compliance Disclaimer Banner */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon />}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        <strong>Telemetry Notice:</strong> "Google Review Link Clicks" measures customer intent (the number of customers who opened your official Google review form). Confirmed published reviews are synced from your Google Business Profile.
      </Alert>

      {/* 2. Top Metric KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: 2,
          mb: 3
        }}
      >
        <StatCard
          title="Total QR Scans"
          value={summary.totalScans}
          icon={<QrCodeScannerIcon />}
          color="#2563EB"
          trendLabel="Unique table & counter scans"
        />

        <StatCard
          title="Google Link Clicks"
          value={summary.totalGoogleClicks}
          icon={<OpenInNewIcon />}
          color="#4285F4"
          trendLabel="Customer review intent"
        />

        <StatCard
          title="Private Feedbacks"
          value={summary.totalFeedbacks}
          icon={<ChatBubbleOutlineIcon />}
          color="#10B981"
          trendLabel="Internal direct ratings"
        />

        <StatCard
          title="Overall Conversion"
          value={`${summary.conversionRate}%`}
          icon={<TrendingUpIcon />}
          color="#8B5CF6"
          trendLabel="(Clicks + Feedback) / Scans"
        />

        <StatCard
          title="Avg Private Rating"
          value={`${summary.averagePrivateRating}★`}
          icon={<StarIcon />}
          color="#F59E0B"
          trendLabel={summary.averagePrivateRating >= 4 ? 'High satisfaction' : 'Needs attention'}
        />

        <StatCard
          title="Active QR Codes"
          value={summary.activeQrCount}
          icon={<CheckCircleOutlinedIcon />}
          color="#0EA5E9"
          trendLabel="Tables & branches deployed"
        />
      </Box>

      {/* 3. Recharts Visualizations */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Chart 1: Star Rating Distribution */}
        <AppCard title="Private Rating Distribution" subheader="Customer satisfaction breakdown across all QR scans">
          <Box sx={{ height: 260, pt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="stars" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </AppCard>

        {/* Chart 2: Sentiment Breakdown Donut */}
        <AppCard title="Customer Sentiment" subheader="Positive vs. Neutral vs. Negative">
          <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sentimentPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No feedback data recorded yet.
              </Typography>
            )}
          </Box>
        </AppCard>
      </Box>

      {/* 4. Top Performing QR Codes & Complaints Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Top QR Codes */}
        <AppCard title="Top Performing QR Codes" subheader="Tables and locations with the highest customer engagement">
          <Box sx={{ pt: 1 }}>
            {summary.topQrCodes && summary.topQrCodes.length > 0 ? (
              summary.topQrCodes.map((code, idx) => (
                <Box
                  key={code.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.2,
                    borderBottom: idx < summary.topQrCodes.length - 1 ? '1px solid #F1F5F9' : 'none'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                      {code.codeLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Google Clicks: {code.googleReviewClicks} • Feedback: {code.feedbackSubmissions}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2563EB' }}>
                      {code.scanCount} scans
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
                No QR scans recorded yet.
              </Typography>
            )}
          </Box>
        </AppCard>

        {/* Complaints Resolution Metrics */}
        <AppCard title="Complaints Resolution Health" subheader="Customer issue resolution tracking">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, pt: 2, textAlign: 'center' }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#DC2626' }}>
                {summary.complaintsSummary.open}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#991B1B' }}>
                OPEN
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#FED7AA', backgroundColor: '#FFF7ED' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#EA580C' }}>
                {summary.complaintsSummary.inProgress}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#9A3412' }}>
                IN PROGRESS
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#A7F3D0', backgroundColor: '#ECFDF5' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#059669' }}>
                {summary.complaintsSummary.resolved}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#065F46' }}>
                RESOLVED
              </Typography>
            </Paper>
          </Box>
        </AppCard>
      </Box>
    </Box>
  );
};

export default QrAnalyticsTab;
