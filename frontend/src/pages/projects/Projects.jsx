import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';

import PageHeader from '../../components/PageHeader';
import { dbService } from '../../services/dbService';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

const SERVICE_TYPES = [
  'Custom Software',
  'Web Development',
  'Mobile App',
  'Cloud & DevOps',
  'AI / ML',
  'Cybersecurity'
];

const HEALTH_COLORS = {
  ON_TRACK: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: 'On Track' },
  AT_RISK: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', label: 'At Risk' },
  DELAYED: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', label: 'Delayed' }
};

const STATUS_CONFIG = {
  PLANNING: { color: 'default', label: 'Planning' },
  IN_PROGRESS: { color: 'primary', label: 'In Progress' },
  IN_REVIEW: { color: 'info', label: 'In Review' },
  QA_UAT: { color: 'warning', label: 'QA / UAT' },
  DEPLOYED: { color: 'success', label: 'Deployed' },
  COMPLETED: { color: 'success', label: 'Completed' },
  ON_HOLD: { color: 'error', label: 'On Hold' },
  CANCELLED: { color: 'default', label: 'Cancelled' }
};

const PRIORITY_COLORS = {
  CRITICAL: { bg: '#FEE2E2', text: '#991B1B' },
  HIGH: { bg: '#FFEDD5', text: '#9A3412' },
  MEDIUM: { bg: '#E0E7FF', text: '#3730A3' },
  LOW: { bg: '#F3F4F6', text: '#4B5563' }
};

export const Projects = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { currentUser, isAdmin, isOperations, isConsultant } = useAuth();

  const canCreate = isAdmin || isOperations || isConsultant || currentUser?.role === 'super_admin';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [healthFilter, setHealthFilter] = useState('ALL');

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    serviceType: 'Custom Software',
    clientId: '',
    budget: '',
    currency: 'USD',
    priority: 'MEDIUM',
    status: 'PLANNING',
    techStackInput: '',
    repositoryUrl: '',
    stagingUrl: '',
    productionUrl: ''
  });

  // Queries
  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', { status: statusFilter, service: serviceFilter, health: healthFilter, search: searchTerm }],
    queryFn: () => dbService.getProjects({
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      serviceType: serviceFilter !== 'ALL' ? serviceFilter : undefined,
      health: healthFilter !== 'ALL' ? healthFilter : undefined,
      search: searchTerm.trim() || undefined
    })
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients-lookup'],
    queryFn: dbService.getClients,
    enabled: createOpen
  });

  const projects = Array.isArray(projectsResponse?.data)
    ? projectsResponse.data
    : (Array.isArray(projectsResponse) ? projectsResponse : []);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (payload) => dbService.createProject(payload),
    onSuccess: (res) => {
      showAlert('IT Project created successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCreateOpen(false);
      setCreateForm({
        name: '',
        description: '',
        serviceType: 'Custom Software',
        clientId: '',
        budget: '',
        currency: 'USD',
        priority: 'MEDIUM',
        status: 'PLANNING',
        techStackInput: '',
        repositoryUrl: '',
        stagingUrl: '',
        productionUrl: ''
      });
      if (res?.data?.id) {
        navigate(`/projects/${res.data.id}`);
      }
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to create project', 'error');
    }
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.clientId) {
      showAlert('Project Name and Client are required.', 'warning');
      return;
    }

    const techStack = createForm.techStackInput
      ? createForm.techStackInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    createMutation.mutate({
      ...createForm,
      budget: createForm.budget ? parseFloat(createForm.budget) : 0,
      techStack
    });
  };

  // Metrics summary
  const totalProjects = projects.length;
  const inProgressCount = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const qaCount = projects.filter(p => p.status === 'QA_UAT' || p.status === 'IN_REVIEW').length;
  const completedCount = projects.filter(p => p.status === 'COMPLETED' || p.status === 'DEPLOYED').length;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <PageHeader
        title="IT Projects Management"
        subtitle="Agile sprint execution, tech stack deployments, code repository environments, and client deliverables."
        action={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{
                bgcolor: '#2563EB',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                '&:hover': { bgcolor: '#1D4ED8' }
              }}
            >
              New IT Project
            </Button>
          ) : null
        }
      />

      {/* KPI Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Total Projects
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#0F172A' }}>
              {totalProjects}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #BFDBFE', bgcolor: '#EFF6FF' }}>
            <Typography variant="caption" color="#1E40AF" fontWeight={600} textTransform="uppercase">
              In Development
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#1E40AF' }}>
              {inProgressCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #FDE68A', bgcolor: '#FFFBEB' }}>
            <Typography variant="caption" color="#B45309" fontWeight={600} textTransform="uppercase">
              QA & UAT Testing
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#B45309' }}>
              {qaCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #A7F3D0', bgcolor: '#ECFDF5' }}>
            <Typography variant="caption" color="#047857" fontWeight={600} textTransform="uppercase">
              Completed / Live
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#047857' }}>
              {completedCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={2.4}>
          <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Committed Budget
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#2563EB' }}>
              ${totalBudget.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by code, title, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="PLANNING">Planning</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="IN_REVIEW">In Review</MenuItem>
                <MenuItem value="QA_UAT">QA / UAT</MenuItem>
                <MenuItem value="DEPLOYED">Deployed</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="ON_HOLD">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Service Type</InputLabel>
              <Select value={serviceFilter} label="Service Type" onChange={(e) => setServiceFilter(e.target.value)}>
                <MenuItem value="ALL">All Services</MenuItem>
                {SERVICE_TYPES.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Health</InputLabel>
              <Select value={healthFilter} label="Health" onChange={(e) => setHealthFilter(e.target.value)}>
                <MenuItem value="ALL">All Health</MenuItem>
                <MenuItem value="ON_TRACK">On Track</MenuItem>
                <MenuItem value="AT_RISK">At Risk</MenuItem>
                <MenuItem value="DELAYED">Delayed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={12} md={1} sx={{ textAlign: 'right' }}>
            <Tooltip title="Refresh Projects">
              <IconButton onClick={() => refetch()} color="primary" sx={{ border: '1px solid #E2E8F0' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content Area */}
      {isProjectsLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={44} thickness={4} sx={{ color: '#2563EB' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading IT projects and sprint environments...
          </Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
        }>
          {error?.message || 'Failed to load projects. Please verify backend connection.'}
        </Alert>
      ) : projects.length === 0 ? (
        <Paper sx={{ py: 8, px: 3, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1', bgcolor: '#F8FAFC' }}>
          <FolderSpecialIcon sx={{ fontSize: 56, color: '#94A3B8', mb: 1.5 }} />
          <Typography variant="h6" fontWeight={600} color="#334155">
            No IT Projects Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mt: 0.5, mb: 2.5 }}>
            {searchTerm || statusFilter !== 'ALL' || serviceFilter !== 'ALL'
              ? 'No projects match your active search filters. Try adjusting your query parameters.'
              : 'Get started by creating your first IT development project, sprint board, and tech stack repository.'}
          </Typography>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{ bgcolor: '#2563EB', textTransform: 'none', borderRadius: 2 }}
            >
              Create New Project
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {projects.map((project) => {
            const healthMeta = HEALTH_COLORS[project.health] || HEALTH_COLORS.ON_TRACK;
            const statusMeta = STATUS_CONFIG[project.status] || STATUS_CONFIG.PLANNING;
            const priorityMeta = PRIORITY_COLORS[project.priority] || PRIORITY_COLORS.MEDIUM;
            const techStackList = Array.isArray(project.techStack) ? project.techStack : [];

            return (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <Card sx={{
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.1)'
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                    {/* Header Chips */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={project.projectCode || 'PRJ'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: '#EFF6FF',
                            color: '#1D4ED8',
                            fontSize: '0.75rem',
                            border: '1px solid #BFDBFE'
                          }}
                        />
                        <Chip
                          label={project.priority || 'MEDIUM'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: priorityMeta.bg,
                            color: priorityMeta.text,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Stack>
                      <Chip
                        label={healthMeta.label}
                        size="small"
                        sx={{
                          bgcolor: healthMeta.bg,
                          color: healthMeta.text,
                          border: `1px solid ${healthMeta.border}`,
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Stack>

                    {/* Title & Service */}
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', mb: 0.5, lineHeight: 1.3 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {project.serviceType || 'Custom Software'}
                    </Typography>

                    {/* Client & Manager */}
                    <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Client:</Typography>
                        <Typography variant="caption" fontWeight={600} color="#1E293B">
                          {project.client ? `${project.client.firstName} ${project.client.lastName}` : 'Unassigned'}
                        </Typography>
                      </Stack>
                      {project.projectManager && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">PM:</Typography>
                          <Typography variant="caption" fontWeight={600} color="#1E293B">
                            {project.projectManager.fullName}
                          </Typography>
                        </Stack>
                      )}
                    </Box>

                    {/* Tech Stack Chips */}
                    {techStackList.length > 0 && (
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                        {techStackList.slice(0, 4).map((tech, idx) => (
                          <Chip
                            key={idx}
                            label={tech}
                            size="small"
                            icon={<CodeIcon sx={{ fontSize: '13px !important' }} />}
                            sx={{
                              bgcolor: '#F1F5F9',
                              color: '#334155',
                              fontSize: '0.7rem',
                              height: 22
                            }}
                          />
                        ))}
                        {techStackList.length > 4 && (
                          <Chip
                            label={`+${techStackList.length - 4}`}
                            size="small"
                            sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontSize: '0.7rem', height: 22 }}
                          />
                        )}
                      </Stack>
                    )}

                    {/* Repository and Environment Links */}
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      {project.repositoryUrl && (
                        <Tooltip title="Open Repository">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, borderRadius: 1.5 }}
                          >
                            Repo
                          </Button>
                        </Tooltip>
                      )}
                      {project.stagingUrl && (
                        <Tooltip title="Open Staging Environment">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LanguageIcon />}
                            href={project.stagingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="info"
                            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, borderRadius: 1.5 }}
                          >
                            Staging
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>

                  <Divider />

                  {/* Card Footer */}
                  <CardActions sx={{ p: 2, pt: 1.5, justifyContent: 'space-between', bgcolor: '#FFFFFF' }}>
                    <Chip
                      label={statusMeta.label}
                      color={statusMeta.color}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      sx={{
                        color: '#2563EB',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#EFF6FF' }
                      }}
                    >
                      Workspace
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Project Modal */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            Create New IT Development Project
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Project Name"
                  placeholder="e.g. Enterprise Logistics Cloud Platform"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={createForm.clientId}
                    label="Client"
                    onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
                  >
                    {clients.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name || `${c.firstName} ${c.lastName}`} ({c.clientCode || 'CID'})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={createForm.serviceType}
                    label="Service Type"
                    onChange={(e) => setCreateForm({ ...createForm, serviceType: e.target.value })}
                  >
                    {SERVICE_TYPES.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Budget"
                  value={createForm.budget}
                  onChange={(e) => setCreateForm({ ...createForm, budget: e.target.value })}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={createForm.priority}
                    label="Priority"
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tech Stack (comma-separated)"
                  placeholder="React, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS"
                  value={createForm.techStackInput}
                  onChange={(e) => setCreateForm({ ...createForm, techStackInput: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Git Repository URL"
                  placeholder="https://github.com/organization/repo"
                  value={createForm.repositoryUrl}
                  onChange={(e) => setCreateForm({ ...createForm, repositoryUrl: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Staging Deployment URL"
                  placeholder="https://staging.myapp.io"
                  value={createForm.stagingUrl}
                  onChange={(e) => setCreateForm({ ...createForm, stagingUrl: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Scope & Architecture Description"
                  placeholder="Core technical specifications, architectural objectives, milestones..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setCreateOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading}
              sx={{ bgcolor: '#2563EB', textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {createMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
