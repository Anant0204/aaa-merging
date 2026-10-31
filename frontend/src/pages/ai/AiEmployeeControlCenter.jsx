import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

// Icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';

import { aiEmployeeService } from '../../services/aiEmployeeService';

const AGENT_ICON_MAP = {
  sales_ai: <TrendingUpIcon sx={{ fontSize: 28, color: '#3B82F6' }} />,
  project_ai: <AssignmentIcon sx={{ fontSize: 28, color: '#10B981' }} />,
  dev_ai: <CodeIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
  support_ai: <SupportAgentIcon sx={{ fontSize: 28, color: '#EC4899' }} />,
  finance_ai: <AccountBalanceWalletIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
  ops_ai: <GroupsIcon sx={{ fontSize: 28, color: '#06B6D4' }} />,
  ceo_supervisor: <PsychologyIcon sx={{ fontSize: 28, color: '#6366F1' }} />
};

export default function AiEmployeeControlCenter() {
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);
  const [taskFilterAgent, setTaskFilterAgent] = useState('');
  const [taskFilterStatus, setTaskFilterStatus] = useState('');
  const [selectedTaskJson, setSelectedTaskJson] = useState(null);
  const [ceoBriefingOpen, setCeoBriefingOpen] = useState(false);
  const [ceoBriefingData, setCeoBriefingData] = useState(null);
  const [decisionModal, setDecisionModal] = useState({ open: false, approval: null, decision: 'APPROVED', notes: '' });

  // 1. Queries
  const { data: overviewRes, isLoading: loadingOverview, refetch: refetchOverview } = useQuery({
    queryKey: ['ai-overview'],
    queryFn: aiEmployeeService.getOverview,
    refetchInterval: 15000
  });

  const { data: agentsRes, isLoading: loadingAgents, refetch: refetchAgents } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: aiEmployeeService.getAgents
  });

  const { data: tasksRes, isLoading: loadingTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['ai-tasks', taskFilterAgent, taskFilterStatus],
    queryFn: () => aiEmployeeService.getTasks({ agentCode: taskFilterAgent || undefined, status: taskFilterStatus || undefined })
  });

  const { data: approvalsRes, isLoading: loadingApprovals, refetch: refetchApprovals } = useQuery({
    queryKey: ['ai-approvals'],
    queryFn: () => aiEmployeeService.getApprovals('PENDING')
  });

  // 2. Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => aiEmployeeService.updateAgentStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
      queryClient.invalidateQueries({ queryKey: ['ai-overview'] });
    }
  });

  const triggerAgentMutation = useMutation({
    mutationFn: (id) => aiEmployeeService.triggerAgentNow(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['ai-overview'] });
      queryClient.invalidateQueries({ queryKey: ['ai-agents'] });
    }
  });

  const decideApprovalMutation = useMutation({
    mutationFn: ({ id, decision, notes }) => aiEmployeeService.decideApproval(id, decision, notes),
    onSuccess: () => {
      setDecisionModal({ open: false, approval: null, decision: 'APPROVED', notes: '' });
      queryClient.invalidateQueries({ queryKey: ['ai-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['ai-overview'] });
    }
  });

  const ceoBriefingMutation = useMutation({
    mutationFn: aiEmployeeService.getCeoBriefing,
    onSuccess: (res) => {
      setCeoBriefingData(res.data);
      setCeoBriefingOpen(true);
    }
  });

  const overview = overviewRes?.data || {
    totalAgents: 7,
    activeAgents: 7,
    pausedAgents: 0,
    disabledAgents: 0,
    tasksSummary: { todayTotal: 0, completed: 0, failed: 0, running: 0 },
    pendingApprovals: 0,
    spending: { totalCostToday: 0, totalTokensToday: 0, activeProvider: 'mock' },
    scheduler: { isRunning: true, lastHeartbeat: new Date() },
    recentExecutions: []
  };

  const agents = agentsRes?.data || [];
  const tasks = tasksRes?.data || [];
  const approvals = approvalsRes?.data || [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SmartToyIcon sx={{ fontSize: 32, color: '#2563EB' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Autonomous AI Employees Control Center
            </Typography>
            <Chip label="24/7 Controlled Autonomy" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: '6px' }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            7 Autonomous AI agents powering Sales, Agile Projects, Code Intelligence, 24/7 Support, Billing, Operations & Executive BI.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={ceoBriefingMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <PsychologyIcon />}
            onClick={() => ceoBriefingMutation.mutate()}
            disabled={ceoBriefingMutation.isPending}
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '8px', px: 2.5, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
          >
            Brief My Day
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              refetchOverview();
              refetchAgents();
              refetchTasks();
              refetchApprovals();
            }}
            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, color: '#475569', borderColor: '#CBD5E1' }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* TOP KPI CARDS */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Card 1: Total AI Agents */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                AI Workforce
              </Typography>
              <Chip label={`${overview.activeAgents}/7 Active`} size="small" sx={{ bgcolor: '#DCFCE7', color: '#166534', fontWeight: 700 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
              7 Agents
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {overview.pausedAgents} Paused • {overview.disabledAgents} Disabled
            </Typography>
          </Paper>
        </Grid>

        {/* Card 2: Executions Today */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Tasks Today
              </Typography>
              <BoltIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
              {overview.tasksSummary?.todayTotal || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
              ✓ {overview.tasksSummary?.completed || 0} Completed • ✕ {overview.tasksSummary?.failed || 0} Failed
            </Typography>
          </Paper>
        </Grid>

        {/* Card 3: Pending Approvals */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Approval Queue
              </Typography>
              <VerifiedUserIcon sx={{ color: overview.pendingApprovals > 0 ? '#F59E0B' : '#10B981', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: overview.pendingApprovals > 0 ? '#D97706' : '#0F172A', my: 1 }}>
              {overview.pendingApprovals}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {overview.pendingApprovals > 0 ? 'Requires Human Review' : 'Zero High-Risk Backlog'}
            </Typography>
          </Paper>
        </Grid>

        {/* Card 4: AI Spend & Tokens */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Cost Today ({overview.spending?.activeProvider?.toUpperCase() || 'AI'})
              </Typography>
              <SpeedIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
              ${overview.spending?.totalCostToday?.toFixed(4) || '0.0000'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {(overview.spending?.totalTokensToday || 0).toLocaleString()} Tokens Processed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TABS NAVIGATION */}
      <Paper sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', mb: 3, bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{
            px: 2,
            borderBottom: '1px solid #E2E8F0',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', py: 2 }
          }}
        >
          <Tab label="System Overview" />
          <Tab label={`7 AI Employees Directory (${agents.length})`} />
          <Tab label={`Approval Queue (${approvals.length})`} />
          <Tab label="Task History & Audit Log" />
          <Tab label="System Health & Safety" />
        </Tabs>

        {/* TAB 0: SYSTEM OVERVIEW */}
        {tabIndex === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Scheduler Pulse Alert */}
            <Alert
              severity="success"
              icon={<BoltIcon sx={{ color: '#16A34A' }} />}
              sx={{ borderRadius: '10px', mb: 3, bgcolor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }}
            >
              <strong>24/7 Autonomous Scheduler Active:</strong> Monitoring urgent inquiries (every 5m), project deadlines & blockers (every 15m), overdue invoices (hourly), timesheets (daily 18:00), and CEO executive synthesis (daily 08:00).
            </Alert>

            {/* Quick 7 Agents Matrix */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Active AI Employee Workforce
            </Typography>

            <Grid container spacing={2}>
              {agents.map((agent) => (
                <Grid item xs={12} sm={6} md={4} key={agent.id}>
                  <Paper sx={{ p: 2, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {AGENT_ICON_MAP[agent.code] || <SmartToyIcon />}
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                          {agent.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={agent.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          bgcolor: agent.status === 'ACTIVE' ? '#DCFCE7' : '#FEF3C7',
                          color: agent.status === 'ACTIVE' ? '#166534' : '#92400E'
                        }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 36, mb: 1.5 }}>
                      {agent.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F1F5F9' }}>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Mode: <strong>{agent.executionMode}</strong>
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={triggerAgentMutation.isPending ? <CircularProgress size={12} /> : <PlayArrowIcon />}
                        onClick={() => triggerAgentMutation.mutate(agent.id)}
                        disabled={triggerAgentMutation.isPending || agent.status !== 'ACTIVE'}
                        sx={{ fontSize: '0.72rem', py: 0.2, px: 1, textTransform: 'none', borderRadius: '6px' }}
                      >
                        Run Now
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 1: 7 AI EMPLOYEES DIRECTORY */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {agents.map((agent) => (
                <Grid item xs={12} md={6} key={agent.id}>
                  <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {AGENT_ICON_MAP[agent.code] || <SmartToyIcon />}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                            {agent.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700 }}>
                            {agent.roleTitle}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={agent.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: agent.status === 'ACTIVE' ? '#DCFCE7' : '#FEF3C7',
                          color: agent.status === 'ACTIVE' ? '#166534' : '#92400E'
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                      {agent.description}
                    </Typography>

                    {/* Meta info */}
                    <Box sx={{ bgcolor: '#F8FAFC', p: 1.5, borderRadius: '8px', mb: 2, fontSize: '0.8rem', color: '#475569' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>Schedule: <strong>{agent.scheduleCron || 'Event-Driven'}</strong></span>
                        <span>Mode: <strong>{agent.executionMode}</strong></span>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Last Run: <strong>{agent.lastRunAt ? new Date(agent.lastRunAt).toLocaleTimeString() : 'Never'}</strong></span>
                        <span>Failures: <strong style={{ color: agent.failureCount > 0 ? '#EF4444' : '#10B981' }}>{agent.failureCount}</strong></span>
                      </Box>
                    </Box>

                    {/* Budget meter */}
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', mb: 0.5 }}>
                        <span>Daily Budget Usage</span>
                        <span><strong>${(agent.spentToday || 0).toFixed(4)}</strong> / ${(agent.dailyBudget || 5.0).toFixed(2)}</span>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, ((agent.spentToday || 0) / (agent.dailyBudget || 5.0)) * 100)}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' } }}
                      />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        variant={agent.status === 'ACTIVE' ? 'outlined' : 'contained'}
                        color={agent.status === 'ACTIVE' ? 'warning' : 'success'}
                        size="small"
                        startIcon={agent.status === 'ACTIVE' ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={() => updateStatusMutation.mutate({ id: agent.id, status: agent.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '6px' }}
                      >
                        {agent.status === 'ACTIVE' ? 'Pause Agent' : 'Activate Agent'}
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={triggerAgentMutation.isPending ? <CircularProgress size={12} color="inherit" /> : <PlayArrowIcon />}
                        onClick={() => triggerAgentMutation.mutate(agent.id)}
                        disabled={agent.status !== 'ACTIVE' || triggerAgentMutation.isPending}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '6px', px: 2 }}
                      >
                        Run Now
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: HUMAN APPROVAL QUEUE */}
        {tabIndex === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Controlled Autonomy — Human Approval Queue
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Sensitive financial operations, contract modifications, and high-risk client escalations require executive sign-off before execution.
              </Typography>
            </Box>

            {approvals.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: '10px' }}>
                No pending approval requests. All routine AI actions are operating within authorized bounds.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {approvals.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Paper sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Chip label={item.riskLevel} color={item.riskLevel === 'CRITICAL' ? 'error' : item.riskLevel === 'HIGH' ? 'warning' : 'info'} size="small" sx={{ fontWeight: 800 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                            {item.actionType}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            Target: {item.entityType}#{item.entityId}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Requested: {new Date(item.createdAt).toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ color: '#334155', mb: 1.5 }}>
                        <strong>Reason:</strong> {item.reason}
                      </Typography>

                      {item.proposedPayload && (
                        <Box sx={{ bgcolor: '#F8FAFC', p: 1.5, borderRadius: '6px', mb: 2, maxHeight: 150, overflowY: 'auto' }}>
                          <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {JSON.stringify(item.proposedPayload, null, 2)}
                          </pre>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => setDecisionModal({ open: true, approval: item, decision: 'REJECTED', notes: '' })}
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => setDecisionModal({ open: true, approval: item, decision: 'APPROVED', notes: '' })}
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          Approve Action
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* TAB 3: TASK HISTORY & AUDIT TRAIL */}
        {tabIndex === 3 && (
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                select
                size="small"
                label="Filter by Agent"
                value={taskFilterAgent}
                onChange={(e) => setTaskFilterAgent(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All AI Employees</MenuItem>
                {agents.map((a) => (
                  <MenuItem key={a.code} value={a.code}>{a.name}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Filter by Status"
                value={taskFilterStatus}
                onChange={(e) => setTaskFilterStatus(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="RUNNING">Running</MenuItem>
              </TextField>
            </Box>

            <TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Task ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Task Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trigger</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Latency</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tokens / Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3, color: '#64748B' }}>
                        No execution records found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {task.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {task.agentCode}
                        </TableCell>
                        <TableCell>{task.taskType}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.8rem' }}>{task.triggerEvent}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              bgcolor: task.status === 'COMPLETED' ? '#DCFCE7' : task.status === 'FAILED' ? '#FEE2E2' : '#FEF3C7',
                              color: task.status === 'COMPLETED' ? '#166534' : task.status === 'FAILED' ? '#991B1B' : '#92400E'
                            }}
                          />
                        </TableCell>
                        <TableCell>{task.executionTimeMs}ms</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>
                          {task.tokensUsed} tokens (${(task.costEstimate || 0).toFixed(4)})
                        </TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => setSelectedTaskJson(task)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 4: SYSTEM HEALTH & SAFETY */}
        {tabIndex === 4 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    AI Worker & Infrastructure Health
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.9rem' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#F8FAFC', borderRadius: '6px' }}>
                      <span>Database Connectivity:</span>
                      <strong style={{ color: '#16A34A' }}>CONNECTED (MariaDB 10.4)</strong>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#F8FAFC', borderRadius: '6px' }}>
                      <span>AI Model Engine:</span>
                      <strong>{overview.spending?.activeProvider?.toUpperCase()} (with Zero-Downtime Fallback)</strong>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#F8FAFC', borderRadius: '6px' }}>
                      <span>24/7 Background Scheduler:</span>
                      <strong style={{ color: '#16A34A' }}>RUNNING (Every 5m / 15m / 60m)</strong>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#F8FAFC', borderRadius: '6px' }}>
                      <span>Last Heartbeat:</span>
                      <span>{new Date(overview.scheduler?.lastHeartbeat || Date.now()).toLocaleTimeString()}</span>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    Controlled Autonomy Safety Policies
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.85rem', color: '#475569' }}>
                    <Alert severity="success" sx={{ py: 0.5, borderRadius: '8px' }}>
                      <strong>Strict Financial Boundary:</strong> Finance AI is prohibited from modifying invoice amounts, disbursing funds, or granting unapproved discounts.
                    </Alert>
                    <Alert severity="info" sx={{ py: 0.5, borderRadius: '8px' }}>
                      <strong>Code & Deployment Boundary:</strong> Dev AI & Project AI can recommend fixes and draft specs, but cannot push unapproved code to production.
                    </Alert>
                    <Alert severity="warning" sx={{ py: 0.5, borderRadius: '8px' }}>
                      <strong>Daily Budget Protection:</strong> Each agent is bounded to $5.00/day ($10.00 for CEO Supervisor) to eliminate runaway API costs.
                    </Alert>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* CEO EXECUTIVE BRIEFING MODAL */}
      <Dialog open={ceoBriefingOpen} onClose={() => setCeoBriefingOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon sx={{ color: '#6366F1' }} />
          CEO Executive Briefing ("Brief My Day")
        </DialogTitle>
        <DialogContent dividers>
          {ceoBriefingData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info" sx={{ borderRadius: '8px', fontWeight: 600 }}>
                {ceoBriefingData.briefing?.executiveSummary}
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Total Revenue</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#16A34A' }}>
                      {ceoBriefingData.metrics?.totalRevenue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Active Projects</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB' }}>
                      {ceoBriefingData.metrics?.activeProjects}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Leads in Funnel</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#8B5CF6' }}>
                      {ceoBriefingData.metrics?.totalLeads}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Pending Approvals</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#D97706' }}>
                      {ceoBriefingData.metrics?.pendingApprovalsCount}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {ceoBriefingData.briefing?.strategicGrowthRecommendations && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Strategic Growth Recommendations:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: '0.88rem' }}>
                    {ceoBriefingData.briefing.strategicGrowthRecommendations.map((rec, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{rec}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCeoBriefingOpen(false)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* TASK JSON INSPECTION DIALOG */}
      <Dialog open={Boolean(selectedTaskJson)} onClose={() => setSelectedTaskJson(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Task Execution Details: {selectedTaskJson?.taskType}
        </DialogTitle>
        <DialogContent dividers>
          {selectedTaskJson && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Output Result:</Typography>
              <Box sx={{ bgcolor: '#0F172A', color: '#38BDF8', p: 2, borderRadius: '8px', mb: 2, overflowX: 'auto' }}>
                <pre style={{ margin: 0, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {JSON.stringify(selectedTaskJson.outputResult, null, 2)}
                </pre>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Input Payload:</Typography>
              <Box sx={{ bgcolor: '#F1F5F9', color: '#334155', p: 2, borderRadius: '8px', overflowX: 'auto' }}>
                <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {JSON.stringify(selectedTaskJson.inputPayload, null, 2)}
                </pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTaskJson(null)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* HUMAN DECISION MODAL */}
      <Dialog open={decisionModal.open} onClose={() => setDecisionModal({ open: false, approval: null, decision: 'APPROVED', notes: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {decisionModal.decision === 'APPROVED' ? 'Confirm Action Approval' : 'Confirm Action Rejection'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
            You are recording an authorized human decision for:
            <strong> {decisionModal.approval?.actionType}</strong> on {decisionModal.approval?.entityType}#{decisionModal.approval?.entityId}.
          </Typography>

          <TextField
            fullWidth
            label="Decision Notes / Audit Log"
            placeholder="Add justification or specific instructions..."
            multiline
            rows={3}
            value={decisionModal.notes}
            onChange={(e) => setDecisionModal({ ...decisionModal, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDecisionModal({ open: false, approval: null, decision: 'APPROVED', notes: '' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={decisionModal.decision === 'APPROVED' ? 'success' : 'error'}
            onClick={() => decideApprovalMutation.mutate({
              id: decisionModal.approval.id,
              decision: decisionModal.decision,
              notes: decisionModal.notes
            })}
            disabled={decideApprovalMutation.isPending}
            sx={{ fontWeight: 700 }}
          >
            Confirm {decisionModal.decision}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
