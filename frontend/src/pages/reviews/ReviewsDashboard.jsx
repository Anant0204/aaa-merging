import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import dayjs from 'dayjs';

// Icons
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import SettingsIcon from '@mui/icons-material/Settings';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LockIcon from '@mui/icons-material/Lock';
import ClearIcon from '@mui/icons-material/Clear';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BarChartIcon from '@mui/icons-material/BarChart';
import TuneIcon from '@mui/icons-material/Tune';

// Smart QR Subcomponents
import QrCodeManagementTab from './components/QrCodeManagementTab';
import CustomerFeedbackTab from './components/CustomerFeedbackTab';
import ComplaintsTab from './components/ComplaintsTab';
import QrAnalyticsTab from './components/QrAnalyticsTab';
import QrBrandingSettingsTab from './components/QrBrandingSettingsTab';

// Project imports
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import AppCard from '../../components/AppCard';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

// Provider brand configurations
const PROVIDER_METADATA = {
  GOOGLE: {
    name: 'Google Business Profile',
    shortName: 'Google',
    color: '#4285F4',
    bg: '#E8F0FE',
    border: '#C2D7FA',
    desc: 'Google Business Profile API (Location Reviews & Owner Replies)',
    supportsLiveSync: true
  },
  META: {
    name: 'Meta / Facebook',
    shortName: 'Meta',
    color: '#1877F2',
    bg: '#EBF3FE',
    border: '#BDD7FD',
    desc: 'Facebook Graph API / Page Reviews',
    supportsLiveSync: true
  },
  CLUTCH: {
    name: 'Clutch.co',
    shortName: 'Clutch',
    color: '#FF4F00',
    bg: '#FFF0EA',
    border: '#FFCCBA',
    desc: 'Verified Manual & CSV Ingestion Mode (REST API Enterprise only)',
    supportsLiveSync: false
  },
  TRUSTPILOT: {
    name: 'Trustpilot',
    shortName: 'Trustpilot',
    color: '#00B67A',
    bg: '#E6F8F2',
    border: '#B3EBD7',
    desc: 'Trustpilot Business API connection',
    supportsLiveSync: true
  }
};

// Fallback demo reviews in case backend table is unmigrated
const FALLBACK_DEMO_REVIEWS = [
  {
    id: 'demo-fallback-1',
    provider: 'GOOGLE',
    externalReviewId: 'demo_google_1',
    authorName: 'Marcus Vance',
    rating: 5,
    reviewText: 'Outstanding software architecture and delivery. The web platform was delivered on time and our team productivity doubled.',
    reviewDate: '2026-10-15T10:30:00Z',
    sentiment: 'POSITIVE',
    responseStatus: 'RESPONDED',
    responseText: 'Thank you Marcus! It was a pleasure working with your team to deliver the high-performance web platform.',
    respondedAt: '2026-10-15T14:20:00Z',
    respondedBy: { fullName: 'Super Admin', role: 'super_admin' },
    status: 'PUBLISHED',
    isDemo: true
  },
  {
    id: 'demo-fallback-2',
    provider: 'CLUTCH',
    externalReviewId: 'demo_clutch_1',
    authorName: 'Elena Rostova',
    rating: 5,
    reviewText: 'Their full-stack cloud engineering team transformed our legacy database into a resilient, scalable microservices stack.',
    reviewDate: '2026-10-18T16:45:00Z',
    sentiment: 'POSITIVE',
    responseStatus: 'UNRESPONDED',
    status: 'PUBLISHED',
    isDemo: true
  },
  {
    id: 'demo-fallback-3',
    provider: 'META',
    externalReviewId: 'demo_meta_1',
    authorName: 'David Chen',
    rating: 4,
    reviewText: 'Great mobile app UX design and prompt sprint updates. Deployment took a few extra days due to Apple App Store approvals.',
    reviewDate: '2026-10-20T09:15:00Z',
    sentiment: 'NEUTRAL',
    responseStatus: 'RESPONDED',
    responseText: 'Thanks David! We appreciate your feedback and are continually optimizing our iOS release timeline.',
    respondedAt: '2026-10-20T11:00:00Z',
    respondedBy: { fullName: 'Admin User', role: 'admin' },
    status: 'PUBLISHED',
    isDemo: true
  },
  {
    id: 'demo-fallback-4',
    provider: 'TRUSTPILOT',
    externalReviewId: 'demo_trustpilot_1',
    authorName: 'Sophia Lindqvist',
    rating: 5,
    reviewText: 'Exceptional AI workflow integration. Automated 75% of our client onboarding processes smoothly.',
    reviewDate: '2026-10-22T13:00:00Z',
    sentiment: 'POSITIVE',
    responseStatus: 'UNRESPONDED',
    status: 'PUBLISHED',
    isDemo: true
  }
];

export const ReviewsDashboard = () => {
  const queryClient = useQueryClient();
  const { currentUser, isSuperAdmin, isAdmin, isOperations, isMarketing } = useAuth();
  const { showAlert } = useAlert();

  // Navigation Tabs: 0: Reviews, 1: Smart QR, 2: Feedback, 3: Complaints, 4: Analytics, 5: Branding
  const [activeTab, setActiveTab] = useState(0);

  // Mode and Filters
  const [showDemo, setShowDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [selectedResponseStatus, setSelectedResponseStatus] = useState('ALL');
  const [selectedModerationStatus, setSelectedModerationStatus] = useState('ALL');

  // Dialog States
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [activeReviewForReply, setActiveReviewForReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    provider: 'CLUTCH',
    authorName: '',
    authorEmail: '',
    rating: 5,
    reviewDate: dayjs().format('YYYY-MM-DD'),
    reviewText: '',
    projectType: 'Web Development',
    externalReviewId: ''
  });

  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [activeProviderForConfig, setActiveProviderForConfig] = useState(null);
  const [configForm, setConfigForm] = useState({
    accountIdentifier: '',
    apiKey: '',
    apiSecret: '',
    autoSyncEnabled: false
  });
  const [showSecret, setShowSecret] = useState(false);

  // Moderation Menu
  const [moderationMenuAnchor, setModerationMenuAnchor] = useState(null);
  const [activeReviewForModeration, setActiveReviewForModeration] = useState(null);

  // Queries
  const { data: qrSettingsData } = useQuery({
    queryKey: ['qr-settings'],
    queryFn: () => dbService.getQrSettings(),
    staleTime: 60000
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['review-stats', showDemo],
    queryFn: () => dbService.getReviewStats(showDemo),
    retry: 1
  });

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews
  } = useQuery({
    queryKey: ['reviews-list', showDemo, selectedProvider, selectedRating, selectedSentiment, selectedResponseStatus, selectedModerationStatus, searchTerm],
    queryFn: async () => {
      const params = {};
      if (showDemo) params.isDemo = true;
      if (selectedProvider !== 'ALL') params.provider = selectedProvider;
      if (selectedRating !== 'ALL') params.rating = selectedRating;
      if (selectedSentiment !== 'ALL') params.sentiment = selectedSentiment;
      if (selectedResponseStatus !== 'ALL') params.responseStatus = selectedResponseStatus;
      if (selectedModerationStatus !== 'ALL') params.status = selectedModerationStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      return dbService.getReviews(params);
    },
    retry: 1
  });

  const {
    data: providersData,
    isLoading: isProvidersLoading,
    refetch: refetchProviders
  } = useQuery({
    queryKey: ['review-providers'],
    queryFn: () => dbService.getReviewProviders(),
    retry: 1
  });

  // Effective Reviews List with Fallback
  const reviewsList = useMemo(() => {
    if (reviewsResponse && Array.isArray(reviewsResponse.reviews) && reviewsResponse.reviews.length > 0) {
      return reviewsResponse.reviews;
    }
    // If user requested demo mode and backend returned empty or errored (e.g. pre-migration)
    if (showDemo) {
      let filtered = [...FALLBACK_DEMO_REVIEWS];
      if (selectedProvider !== 'ALL') filtered = filtered.filter(r => r.provider === selectedProvider);
      if (selectedRating !== 'ALL') filtered = filtered.filter(r => r.rating === Number(selectedRating));
      if (selectedSentiment !== 'ALL') filtered = filtered.filter(r => r.sentiment === selectedSentiment);
      if (selectedResponseStatus !== 'ALL') filtered = filtered.filter(r => r.responseStatus === selectedResponseStatus);
      if (selectedModerationStatus !== 'ALL') filtered = filtered.filter(r => r.status === selectedModerationStatus);
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(r => r.authorName.toLowerCase().includes(q) || r.reviewText.toLowerCase().includes(q));
      }
      return filtered;
    }
    return reviewsResponse?.reviews || [];
  }, [reviewsResponse, showDemo, selectedProvider, selectedRating, selectedSentiment, selectedResponseStatus, selectedModerationStatus, searchTerm]);

  // Effective Stats with Fallback
  const stats = useMemo(() => {
    if (statsData && statsData.totalReviews > 0) {
      return statsData;
    }
    if (showDemo) {
      return {
        totalReviews: 4,
        averageRating: 4.8,
        sentiment: { positive: 3, neutral: 1, negative: 0, positivePercentage: 75 },
        byPlatform: {
          GOOGLE: { count: 1, averageRating: 5.0 },
          CLUTCH: { count: 1, averageRating: 5.0 },
          META: { count: 1, averageRating: 4.0 },
          TRUSTPILOT: { count: 1, averageRating: 5.0 }
        },
        responseStats: { responded: 2, unresponded: 2, responseRate: 50 },
        isDemo: true
      };
    }
    return {
      totalReviews: 0,
      averageRating: 0.0,
      sentiment: { positive: 0, neutral: 0, negative: 0, positivePercentage: 0 },
      byPlatform: {},
      responseStats: { responded: 0, unresponded: 0, responseRate: 0 },
      isDemo: false
    };
  }, [statsData, showDemo]);

  // Effective Providers with Fallback
  const providers = useMemo(() => {
    if (Array.isArray(providersData) && providersData.length > 0) {
      return providersData;
    }
    return [
      { provider: 'GOOGLE', name: 'Google Business Profile', supportsLiveSync: true, status: 'CONFIG_REQUIRED', lastSyncAt: null },
      { provider: 'META', name: 'Meta / Facebook', supportsLiveSync: true, status: 'CONFIG_REQUIRED', lastSyncAt: null },
      { provider: 'CLUTCH', name: 'Clutch.co', supportsLiveSync: false, status: 'MANUAL_ONLY', lastSyncAt: null },
      { provider: 'TRUSTPILOT', name: 'Trustpilot', supportsLiveSync: true, status: 'CONFIG_REQUIRED', lastSyncAt: null }
    ];
  }, [providersData]);

  // Mutations
  const replyMutation = useMutation({
    mutationFn: ({ id, text }) => dbService.respondToReview(id, text),
    onSuccess: () => {
      showAlert('Official response submitted successfully.', 'success');
      setReplyDialogOpen(false);
      setReplyText('');
      setActiveReviewForReply(null);
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to submit review response.', 'error');
    }
  });

  const moderationMutation = useMutation({
    mutationFn: ({ id, status }) => dbService.updateReviewStatus(id, status),
    onSuccess: (data, variables) => {
      showAlert(`Review status updated to ${variables.status}.`, 'success');
      setModerationMenuAnchor(null);
      setActiveReviewForModeration(null);
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to update review status.', 'error');
    }
  });

  const manualReviewMutation = useMutation({
    mutationFn: (data) => dbService.createReview(data),
    onSuccess: () => {
      showAlert('Verified review created successfully.', 'success');
      setManualDialogOpen(false);
      setManualForm({
        provider: 'CLUTCH',
        authorName: '',
        authorEmail: '',
        rating: 5,
        reviewDate: dayjs().format('YYYY-MM-DD'),
        reviewText: '',
        projectType: 'Web Development',
        externalReviewId: ''
      });
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to create review.', 'error');
    }
  });

  const syncMutation = useMutation({
    mutationFn: (provider) => dbService.syncReviewProvider(provider),
    onSuccess: (res) => {
      if (res.status === 'MANUAL_ONLY') {
        showAlert(res.message || 'Clutch is configured for manual ingestion.', 'info');
      } else if (res.status === 'CONFIG_REQUIRED') {
        showAlert(`Sync skipped: ${res.message || 'API credentials must be configured.'}`, 'warning');
      } else {
        showAlert(`Provider sync completed (${res.syncedCount || 0} reviews fetched).`, 'success');
      }
      queryClient.invalidateQueries({ queryKey: ['review-providers'] });
      queryClient.invalidateQueries({ queryKey: ['reviews-list'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to sync provider reviews.', 'error');
    }
  });

  const configMutation = useMutation({
    mutationFn: ({ provider, config }) => dbService.updateReviewProviderConfig(provider, config),
    onSuccess: () => {
      showAlert('Provider credentials saved and encrypted securely.', 'success');
      setConfigDialogOpen(false);
      setShowSecret(false);
      setActiveProviderForConfig(null);
      queryClient.invalidateQueries({ queryKey: ['review-providers'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to update provider configuration.', 'error');
    }
  });

  // Action Handlers
  const handleOpenReplyDialog = (review) => {
    setActiveReviewForReply(review);
    setReplyText(review.responseText || '');
    setReplyDialogOpen(true);
  };

  const handleOpenConfigDialog = (provider) => {
    setActiveProviderForConfig(provider);
    setConfigForm({
      accountIdentifier: provider.accountIdentifier || '',
      apiKey: '',
      apiSecret: '',
      autoSyncEnabled: provider.autoSyncEnabled || false
    });
    setShowSecret(false);
    setConfigDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvider('ALL');
    setSelectedRating('ALL');
    setSelectedSentiment('ALL');
    setSelectedResponseStatus('ALL');
    setSelectedModerationStatus('ALL');
  };

  const hasActiveFilters = searchTerm !== '' || selectedProvider !== 'ALL' || selectedRating !== 'ALL' || selectedSentiment !== 'ALL' || selectedResponseStatus !== 'ALL' || selectedModerationStatus !== 'ALL';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* 1. Header */}
      <PageHeader
        title="Reviews & Reputation"
        subtitle="Centralized multi-platform client feedback, sentiment analysis, and official responses"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reviews & Reputation' }
        ]}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {activeTab === 0 && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showDemo}
                      onChange={(e) => setShowDemo(e.target.checked)}
                      color="warning"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Demo Mode
                      {showDemo && <Chip label="ON" size="small" color="warning" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />}
                    </Typography>
                  }
                />

                {(isAdmin || isSuperAdmin || isOperations) && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setManualDialogOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    + Add Verified Review
                  </Button>
                )}

                <Tooltip title="Refresh data">
                  <IconButton
                    onClick={() => {
                      refetchStats();
                      refetchReviews();
                      refetchProviders();
                      showAlert('Review metrics refreshed.', 'info');
                    }}
                    color="inherit"
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        }
      />

      {/* Smart QR & Review Tabs Navigation */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Reviews and Smart QR navigation tabs"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              minHeight: 52,
              py: 1,
              px: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          <Tab icon={<RateReviewIcon fontSize="small" />} iconPosition="start" label="Existing Reviews" />
          <Tab icon={<QrCode2Icon fontSize="small" />} iconPosition="start" label="Smart QR Codes" />
          <Tab icon={<FeedbackIcon fontSize="small" />} iconPosition="start" label="Customer Feedback" />
          <Tab icon={<ReportProblemIcon fontSize="small" />} iconPosition="start" label="Complaints & Issues" />
          <Tab icon={<BarChartIcon fontSize="small" />} iconPosition="start" label="QR Analytics" />
          <Tab icon={<TuneIcon fontSize="small" />} iconPosition="start" label="Branding & Settings" />
        </Tabs>
      </Paper>

      {/* TAB 0: Existing Reviews & Feed */}
      {activeTab === 0 && (
        <Box>

      {/* 2. Banner: Demo Mode Active */}
      {showDemo && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, fontWeight: 500 }}
        >
          <strong>Demonstration Mode Active:</strong> You are viewing illustrative demo reviews and synthetic metrics. Demo data is explicitly flagged with <code>[DEMO]</code> badges and isolated from live production analytics.
        </Alert>
      )}

      {/* 3. Banner: Live Database Setup Notice (If Backend Error or Empty Live Reviews) */}
      {(isReviewsError || isStatsError) && !showDemo && (
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          action={
            <Button color="inherit" size="small" variant="outlined" onClick={() => setShowDemo(true)}>
              Enable Demo Mode
            </Button>
          }
          sx={{ mb: 3 }}
        >
          <strong>Live Database Notice:</strong> Live database tables for reviews have not yet been migrated. You can preview the full dashboard and workflows safely by enabling Demo Mode.
        </Alert>
      )}

      {/* 4. Top Analytics KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          },
          gap: 2,
          mb: 3
        }}
      >
        {/* Card 1: Total Reviews */}
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<RateReviewIcon />}
          color="#2563EB"
          trendLabel={`${stats.isDemo ? 'Demo sample' : 'Aggregated total'}`}
        />

        {/* Card 2: Average Rating */}
        <Paper
          className="flex justify-between relative overflow-hidden transition-all duration-200 border border-solid border-divider shadow-none rounded-[8px]"
          sx={{
            p: { xs: 1.25, sm: 2 },
            height: '100%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              backgroundColor: '#F59E0B'
            }
          }}
        >
          <Box className="flex flex-col gap-1 min-w-0 flex-1 pr-1">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Average Star Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                {(stats.averageRating || 0).toFixed(1)}
              </Typography>
              <Rating
                value={Number(stats.averageRating) || 0}
                precision={0.1}
                readOnly
                size="small"
                sx={{ color: '#F59E0B' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {stats.averageRating >= 4.5 ? '⭐ Excellent satisfaction' : 'Client reputation score'}
            </Typography>
          </Box>
        </Paper>

        {/* Card 3: Positive Sentiment */}
        <Paper
          className="flex justify-between relative overflow-hidden transition-all duration-200 border border-solid border-divider shadow-none rounded-[8px]"
          sx={{
            p: { xs: 1.25, sm: 2 },
            height: '100%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              backgroundColor: '#10B981'
            }
          }}
        >
          <Box className="flex flex-col gap-1 min-w-0 flex-1 pr-1">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Positive Sentiment
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
              {stats.sentiment?.positivePercentage || 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {stats.sentiment?.positive || 0} Pos · {stats.sentiment?.neutral || 0} Neu · {stats.sentiment?.negative || 0} Neg
            </Typography>
          </Box>
        </Paper>

        {/* Card 4: Response Rate */}
        <Paper
          className="flex justify-between relative overflow-hidden transition-all duration-200 border border-solid border-divider shadow-none rounded-[8px]"
          sx={{
            p: { xs: 1.25, sm: 2 },
            height: '100%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              backgroundColor: '#8B5CF6'
            }
          }}
        >
          <Box className="flex flex-col gap-1 min-w-0 flex-1 pr-1">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Official Response Rate
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6', lineHeight: 1 }}>
              {stats.responseStats?.responseRate || 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {stats.responseStats?.responded || 0} Replied · {stats.responseStats?.unresponded || 0} Pending
            </Typography>
          </Box>
        </Paper>

        {/* Card 5: Needs Attention */}
        <StatCard
          title="Needs Response"
          value={stats.responseStats?.unresponded || 0}
          icon={<WarningAmberIcon />}
          color={stats.responseStats?.unresponded > 0 ? '#EF4444' : '#10B981'}
          trendLabel={stats.responseStats?.unresponded > 0 ? 'Pending company reply' : 'All reviews addressed'}
        />
      </Box>

      {/* 5. Connected Platforms Status Bar */}
      <AppCard
        title="Connected Reputation Platforms"
        subheader="Live API status, manual ingestion mode, and credential configuration"
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 2,
            pt: 1
          }}
        >
          {providers.map((p) => {
            const meta = PROVIDER_METADATA[p.provider] || {
              name: p.provider,
              color: '#64748B',
              bg: '#F8FAFC',
              border: '#CBD5E1',
              desc: 'Review source'
            };

            const isClutch = p.provider === 'CLUTCH';
            const isManualOnly = p.status === 'MANUAL_ONLY' || isClutch;
            const isConnected = p.status === 'CONNECTED';
            const isConfigRequired = p.status === 'CONFIG_REQUIRED';

            return (
              <Paper
                key={p.provider}
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  borderRadius: 2,
                  borderColor: meta.border,
                  backgroundColor: meta.bg
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: meta.color }}>
                      {meta.name}
                    </Typography>
                    {isManualOnly ? (
                      <Chip
                        label="MANUAL ONLY"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          backgroundColor: '#E2E8F0',
                          color: '#475569'
                        }}
                      />
                    ) : isConnected ? (
                      <Chip
                        label="CONNECTED"
                        size="small"
                        color="success"
                        icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    ) : (
                      <Chip
                        label="CONFIG REQUIRED"
                        size="small"
                        color="warning"
                        icon={<WarningAmberIcon sx={{ fontSize: '12px !important' }} />}
                        sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', mb: 1 }}>
                    {meta.desc}
                  </Typography>

                  <Box sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    <div><strong>Identifier:</strong> {p.accountIdentifier || (isManualOnly ? 'Verified Form / CSV' : 'Not configured')}</div>
                    <div><strong>Last Sync:</strong> {p.lastSyncAt ? dayjs(p.lastSyncAt).format('MMM D, YYYY h:mm A') : 'Never'}</div>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  {isClutch ? (
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setManualForm(prev => ({ ...prev, provider: 'CLUTCH' }));
                        setManualDialogOpen(true);
                      }}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      + Add Clutch Review
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        startIcon={<SyncIcon />}
                        onClick={() => syncMutation.mutate(p.provider)}
                        disabled={syncMutation.isPending}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        Sync
                      </Button>

                      {isSuperAdmin && (
                        <Tooltip title="Configure encrypted API credentials">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenConfigDialog(p)}
                            sx={{ border: '1px solid', borderColor: 'divider' }}
                          >
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </AppCard>

      {/* 6. Filter & Search Controls */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Filter & Search Reviews
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              color="inherit"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ ml: 'auto', textTransform: 'none', fontSize: '0.75rem' }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)'
            },
            gap: 1.5
          }}
        >
          {/* Search Term */}
          <TextField
            size="small"
            placeholder="Search author or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />

          {/* Provider Filter */}
          <TextField
            select
            size="small"
            label="Provider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <MenuItem value="ALL">All Platforms</MenuItem>
            <MenuItem value="GOOGLE">Google Business</MenuItem>
            <MenuItem value="META">Meta / Facebook</MenuItem>
            <MenuItem value="CLUTCH">Clutch.co</MenuItem>
            <MenuItem value="TRUSTPILOT">Trustpilot</MenuItem>
          </TextField>

          {/* Rating Filter */}
          <TextField
            select
            size="small"
            label="Rating"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <MenuItem value="ALL">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </TextField>

          {/* Sentiment Filter */}
          <TextField
            select
            size="small"
            label="Sentiment"
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
          >
            <MenuItem value="ALL">All Sentiments</MenuItem>
            <MenuItem value="POSITIVE">Positive</MenuItem>
            <MenuItem value="NEUTRAL">Neutral</MenuItem>
            <MenuItem value="NEGATIVE">Negative</MenuItem>
          </TextField>

          {/* Response Status Filter */}
          <TextField
            select
            size="small"
            label="Response"
            value={selectedResponseStatus}
            onChange={(e) => setSelectedResponseStatus(e.target.value)}
          >
            <MenuItem value="ALL">All Responses</MenuItem>
            <MenuItem value="UNRESPONDED">Unanswered</MenuItem>
            <MenuItem value="RESPONDED">Responded</MenuItem>
          </TextField>

          {/* Moderation Status */}
          <TextField
            select
            size="small"
            label="Visibility"
            value={selectedModerationStatus}
            onChange={(e) => setSelectedModerationStatus(e.target.value)}
          >
            <MenuItem value="ALL">All Visibility</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
            <MenuItem value="HIDDEN">Hidden</MenuItem>
            <MenuItem value="FLAGGED">Flagged</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 7. Review Feed List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isReviewsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : reviewsList.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <RateReviewIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5, opacity: 0.6 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              No Reviews Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
              {hasActiveFilters
                ? 'No reviews match your selected filter criteria. Try clearing filters or searching with different terms.'
                : 'No reviews are recorded in the database yet. You can enable Demo Mode to preview the dashboard or add a verified review manually.'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
              {hasActiveFilters && (
                <Button variant="outlined" size="small" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
              {!showDemo && (
                <Button variant="contained" color="warning" size="small" onClick={() => setShowDemo(true)}>
                  Load Demo Reviews
                </Button>
              )}
              {(isAdmin || isSuperAdmin || isOperations) && (
                <Button variant="contained" size="small" onClick={() => setManualDialogOpen(true)}>
                  + Add Verified Review
                </Button>
              )}
            </Box>
          </Paper>
        ) : (
          reviewsList.map((review) => {
            const meta = PROVIDER_METADATA[review.provider] || {
              name: review.provider,
              color: '#64748B',
              bg: '#F8FAFC'
            };

            const isPositive = review.sentiment === 'POSITIVE';
            const isNegative = review.sentiment === 'NEGATIVE';
            const isResponded = review.responseStatus === 'RESPONDED';

            return (
              <Paper
                key={review.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: meta.color
                  }
                }}
              >
                {/* Header Row: Provider, Rating, Sentiment, Moderation, Demo Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={meta.name}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.color}40`
                      }}
                    />

                    <Rating
                      value={Number(review.rating)}
                      readOnly
                      size="small"
                      sx={{ color: '#F59E0B' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {Number(review.rating).toFixed(1)}
                    </Typography>

                    {review.isDemo && (
                      <Chip
                        label="DEMO"
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                      />
                    )}

                    <Chip
                      icon={
                        isPositive ? <SentimentSatisfiedAltIcon sx={{ fontSize: '14px !important' }} />
                        : isNegative ? <SentimentVeryDissatisfiedIcon sx={{ fontSize: '14px !important' }} />
                        : <SentimentNeutralIcon sx={{ fontSize: '14px !important' }} />
                      }
                      label={review.sentiment}
                      size="small"
                      color={isPositive ? 'success' : isNegative ? 'error' : 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                    />

                    {review.status !== 'PUBLISHED' && (
                      <Chip
                        label={review.status}
                        size="small"
                        color={review.status === 'FLAGGED' ? 'error' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {review.reviewDate ? dayjs(review.reviewDate).format('MMM D, YYYY') : ''}
                    </Typography>

                    {(isAdmin || isSuperAdmin) && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setModerationMenuAnchor(e.currentTarget);
                          setActiveReviewForModeration(review);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Reviewer Details */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: meta.color, fontSize: '0.85rem', fontWeight: 700 }}>
                    {review.authorName ? review.authorName.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {review.authorName || 'Anonymous Client'}
                    </Typography>
                    {review.externalReviewId && (
                      <Typography variant="caption" color="text.secondary">
                        ID: {review.externalReviewId}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Review Body */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.6,
                    pl: 1.5,
                    borderLeft: '3px solid',
                    borderColor: 'divider',
                    mb: 2
                  }}
                >
                  "{review.reviewText}"
                </Typography>

                {/* Response Section */}
                {isResponded ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      borderRadius: 1.5,
                      backgroundColor: 'action.hover',
                      borderLeft: '3px solid #2563EB'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ReplyIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563EB', fontSize: '0.82rem' }}>
                          Official Response from AAA Consultancy
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {review.respondedAt ? dayjs(review.respondedAt).format('MMM D, YYYY') : ''}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.primary', pl: 3, mb: 1 }}>
                      {review.responseText}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        Posted by {review.respondedBy?.fullName || 'Staff'} ({review.respondedBy?.role || 'Admin'})
                      </Typography>

                      {(isAdmin || isSuperAdmin || isOperations || isMarketing) && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleOpenReplyDialog(review)}
                          sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.5 }}
                        >
                          Edit Response
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.25,
                      borderRadius: 1.5,
                      backgroundColor: '#FFFBEB',
                      border: '1px dashed #FCD34D'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningAmberIcon sx={{ fontSize: 18, color: '#D97706' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#92400E' }}>
                        No official response posted yet.
                      </Typography>
                    </Box>

                    {(isAdmin || isSuperAdmin || isOperations || isMarketing) && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<ReplyIcon />}
                        onClick={() => handleOpenReplyDialog(review)}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Reply to Review
                      </Button>
                    )}
                  </Box>
                )}
              </Paper>
            );
          })
        )}
      </Box>
        </Box>
      )}

      {/* TAB 1: Smart QR Codes */}
      {activeTab === 1 && (
        <QrCodeManagementTab businessSettings={qrSettingsData?.settings} />
      )}

      {/* TAB 2: Customer Feedback */}
      {activeTab === 2 && (
        <CustomerFeedbackTab />
      )}

      {/* TAB 3: Complaints & Issues */}
      {activeTab === 3 && (
        <ComplaintsTab />
      )}

      {/* TAB 4: QR Analytics */}
      {activeTab === 4 && (
        <QrAnalyticsTab />
      )}

      {/* TAB 5: Branding & Settings */}
      {activeTab === 5 && (
        <QrBrandingSettingsTab />
      )}

      {/* 8. Dialog: Post / Edit Official Reply */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {activeReviewForReply?.responseText ? 'Edit Official Response' : 'Reply to Client Review'}
        </DialogTitle>
        <DialogContent dividers>
          {activeReviewForReply && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {activeReviewForReply.authorName} on {activeReviewForReply.provider}:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                "{activeReviewForReply.reviewText}"
              </Typography>
            </Box>
          )}

          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Official Company Response"
            placeholder="Write a professional response acknowledging the client's feedback..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            helperText="This response will be recorded in the CRM audit trail. Live external platform sync will dispatch when credentials are connected."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReplyDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!replyText.trim()) {
                showAlert('Please write a response before submitting.', 'warning');
                return;
              }
              replyMutation.mutate({
                id: activeReviewForReply.id,
                text: replyText.trim()
              });
            }}
            disabled={replyMutation.isPending}
          >
            {replyMutation.isPending ? 'Posting...' : 'Submit Response'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 9. Dialog: Add Verified Manual / Clutch Review */}
      <Dialog
        open={manualDialogOpen}
        onClose={() => setManualDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Add Verified Review (Manual / Clutch)
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
            Use this form to ingest verified reviews from Clutch, offline testimonials, or clients directly.
          </Alert>

          <TextField
            select
            fullWidth
            label="Provider / Source"
            value={manualForm.provider}
            onChange={(e) => setManualForm(prev => ({ ...prev, provider: e.target.value }))}
          >
            <MenuItem value="CLUTCH">Clutch.co (Manual Mode)</MenuItem>
            <MenuItem value="GOOGLE">Google Business Profile</MenuItem>
            <MenuItem value="META">Meta / Facebook</MenuItem>
            <MenuItem value="TRUSTPILOT">Trustpilot</MenuItem>
          </TextField>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Author / Client Name *"
              required
              value={manualForm.authorName}
              onChange={(e) => setManualForm(prev => ({ ...prev, authorName: e.target.value }))}
            />

            <TextField
              label="Client Email (Optional)"
              value={manualForm.authorEmail}
              onChange={(e) => setManualForm(prev => ({ ...prev, authorEmail: e.target.value }))}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Rating (1 - 5 Stars) *
              </Typography>
              <Rating
                value={Number(manualForm.rating)}
                onChange={(e, val) => setManualForm(prev => ({ ...prev, rating: val || 5 }))}
                size="large"
                sx={{ color: '#F59E0B' }}
              />
            </Box>

            <TextField
              type="date"
              label="Review Date"
              InputLabelProps={{ shrink: true }}
              value={manualForm.reviewDate}
              onChange={(e) => setManualForm(prev => ({ ...prev, reviewDate: e.target.value }))}
            />
          </Box>

          <TextField
            label="Service / Project Category"
            value={manualForm.projectType}
            onChange={(e) => setManualForm(prev => ({ ...prev, projectType: e.target.value }))}
            placeholder="e.g. Web Development, SaaS Platform, AI Workflow"
          />

          <TextField
            label="External Review ID / Clutch URL"
            value={manualForm.externalReviewId}
            onChange={(e) => setManualForm(prev => ({ ...prev, externalReviewId: e.target.value }))}
            placeholder="e.g. clutch_review_8921"
          />

          <TextField
            multiline
            rows={4}
            required
            label="Client Review Text *"
            value={manualForm.reviewText}
            onChange={(e) => setManualForm(prev => ({ ...prev, reviewText: e.target.value }))}
            placeholder="Paste the verified client testimonial or review text here..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setManualDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!manualForm.authorName.trim() || !manualForm.reviewText.trim()) {
                showAlert('Please provide author name and review text.', 'warning');
                return;
              }
              manualReviewMutation.mutate(manualForm);
            }}
            disabled={manualReviewMutation.isPending}
          >
            {manualReviewMutation.isPending ? 'Saving...' : 'Save Verified Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 10. Dialog: Provider Credential Configuration (SuperAdmin Only) */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon fontSize="small" color="primary" />
          Configure {activeProviderForConfig?.name} Credentials
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
            Credentials are encrypted at rest using <strong>AES-256-GCM</strong> authenticated encryption and stored on backend only. They are never exposed in client API responses.
          </Alert>

          <TextField
            fullWidth
            label="Account Identifier / Page ID / Location ID"
            value={configForm.accountIdentifier}
            onChange={(e) => setConfigForm(prev => ({ ...prev, accountIdentifier: e.target.value }))}
            placeholder="e.g. locations/123456789 or 109876543210"
            helperText="The unique platform identifier for your business location or page."
          />

          <TextField
            fullWidth
            label="API Key / Access Token"
            type={showSecret ? 'text' : 'password'}
            value={configForm.apiKey}
            onChange={(e) => setConfigForm(prev => ({ ...prev, apiKey: e.target.value }))}
            placeholder="Leave empty to keep existing encrypted key"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                    {showSecret ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="API Secret / Client Secret"
            type={showSecret ? 'text' : 'password'}
            value={configForm.apiSecret}
            onChange={(e) => setConfigForm(prev => ({ ...prev, apiSecret: e.target.value }))}
            placeholder="Leave empty to keep existing encrypted secret"
          />

          <FormControlLabel
            control={
              <Switch
                checked={configForm.autoSyncEnabled}
                onChange={(e) => setConfigForm(prev => ({ ...prev, autoSyncEnabled: e.target.checked }))}
                color="primary"
              />
            }
            label="Enable Automated Daily Sync"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfigDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!activeProviderForConfig) return;
              configMutation.mutate({
                provider: activeProviderForConfig.provider,
                config: configForm
              });
            }}
            disabled={configMutation.isPending}
          >
            {configMutation.isPending ? 'Encrypting & Saving...' : 'Save Configuration'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 11. Menu: Review Moderation (Publish / Hide / Flag) */}
      <Menu
        anchorEl={moderationMenuAnchor}
        open={Boolean(moderationMenuAnchor)}
        onClose={() => setModerationMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (activeReviewForModeration) {
              moderationMutation.mutate({ id: activeReviewForModeration.id, status: 'PUBLISHED' });
            }
          }}
          disabled={activeReviewForModeration?.status === 'PUBLISHED'}
        >
          Mark as Published
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeReviewForModeration) {
              moderationMutation.mutate({ id: activeReviewForModeration.id, status: 'HIDDEN' });
            }
          }}
          disabled={activeReviewForModeration?.status === 'HIDDEN'}
        >
          Hide from Public Views
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeReviewForModeration) {
              moderationMutation.mutate({ id: activeReviewForModeration.id, status: 'FLAGGED' });
            }
          }}
          disabled={activeReviewForModeration?.status === 'FLAGGED'}
        >
          Flag for Attention
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReviewsDashboard;
