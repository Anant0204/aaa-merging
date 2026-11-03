import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';

import { dbService } from '../../services/dbService';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { currentUser, isAdmin, isOperations, isConsultant } = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    taskType: 'FEATURE',
    priority: 'MEDIUM',
    status: 'TODO',
    estimatedHours: ''
  });

  const [timeLogModalOpen, setTimeLogModalOpen] = useState(false);
  const [timeLogForm, setTimeLogForm] = useState({
    hours: '',
    workDate: new Date().toISOString().split('T')[0],
    description: '',
    isBillable: true
  });

  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    milestoneType: 'SPRINT',
    startDate: '',
    dueDate: ''
  });

  // Query Project
  const {
    data: projectResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['project-detail', id],
    queryFn: () => dbService.getProjectById(id),
    enabled: !!id
  });

  const project = projectResponse?.data || projectResponse;

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (data) => dbService.createTask(id, data),
    onSuccess: () => {
      showAlert('Task created successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
      setTaskModalOpen(false);
      setTaskForm({ title: '', description: '', taskType: 'FEATURE', priority: 'MEDIUM', status: 'TODO', estimatedHours: '' });
    },
    onError: (err) => showAlert(err.response?.data?.message || 'Failed to create task', 'error')
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }) => dbService.updateTask(id, taskId, data),
    onSuccess: () => {
      showAlert('Task status updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
    },
    onError: (err) => showAlert(err.response?.data?.message || 'Failed to update task', 'error')
  });

  const logTimeMutation = useMutation({
    mutationFn: (data) => dbService.logTime(id, data),
    onSuccess: () => {
      showAlert('Work time logged successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
      setTimeLogModalOpen(false);
      setTimeLogForm({ hours: '', workDate: new Date().toISOString().split('T')[0], description: '', isBillable: true });
    },
    onError: (err) => showAlert(err.response?.data?.message || 'Failed to log time', 'error')
  });

  const deleteTimeLogMutation = useMutation({
    mutationFn: (logId) => dbService.deleteTimeLog(id, logId),
    onSuccess: () => {
      showAlert('Time log removed', 'success');
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
    },
    onError: (err) => showAlert(err.response?.data?.message || 'Failed to delete time log', 'error')
  });

  const createMilestoneMutation = useMutation({
    mutationFn: (data) => dbService.createMilestone(id, data),
    onSuccess: () => {
      showAlert('Milestone/Sprint created', 'success');
      queryClient.invalidateQueries({ queryKey: ['project-detail', id] });
      setMilestoneModalOpen(false);
      setMilestoneForm({ title: '', description: '', milestoneType: 'SPRINT', startDate: '', dueDate: '' });
    },
    onError: (err) => showAlert(err.response?.data?.message || 'Failed to create milestone', 'error')
  });

  if (isLoading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress size={44} thickness={4} sx={{ color: '#2563EB' }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading project workspace...
        </Typography>
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'Project not found or access denied.'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')}>
          Return to Projects
        </Button>
      </Box>
    );
  }

  const tasks = project.tasks || [];
  const milestones = project.milestones || [];
  const timeLogs = project.timeLogs || [];
  const handovers = project.handovers || [];
  const metrics = project.metrics || {};
  const techStackList = Array.isArray(project.techStack) ? project.techStack : [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Back button and breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ color: '#475569', textTransform: 'none', fontWeight: 600 }}
        >
          All Projects
        </Button>
        <Typography color="text.secondary">/</Typography>
        <Typography fontWeight={600} color="#1E293B">
          {project.projectCode || 'PRJ'}
        </Typography>
      </Stack>

      {/* Main Project Header Card */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={project.projectCode || 'PRJ'}
                sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8', fontWeight: 700 }}
              />
              <Chip
                label={project.status || 'PLANNING'}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={project.health || 'ON_TRACK'}
                size="small"
                sx={{
                  bgcolor: project.health === 'DELAYED' ? '#FEF2F2' : '#ECFDF5',
                  color: project.health === 'DELAYED' ? '#DC2626' : '#059669',
                  fontWeight: 600
                }}
              />
            </Stack>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ mb: 0.5 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.serviceType} • Client: <b>{project.client ? `${project.client.firstName} ${project.client.lastName}` : 'Unassigned'}</b>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} flexWrap="wrap" useFlexGap>
              {project.repositoryUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GitHubIcon />}
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  GitHub
                </Button>
              )}
              {project.stagingUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  color="info"
                  startIcon={<LanguageIcon />}
                  href={project.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Staging
                </Button>
              )}
              {project.productionUrl && (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<RocketLaunchIcon />}
                  href={project.productionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Production
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Metric Bar */}
        <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #F1F5F9' }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">TASK COMPLETION</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={metrics.taskCompletionRate || 0}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" fontWeight={700}>
                {metrics.taskCompletionRate || 0}%
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">TOTAL TIME LOGGED</Typography>
            <Typography variant="h6" fontWeight={700} color="#0F172A" sx={{ mt: 0.5 }}>
              {metrics.totalHoursLogged || 0} hrs
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">BUDGET ALLOCATED</Typography>
            <Typography variant="h6" fontWeight={700} color="#2563EB" sx={{ mt: 0.5 }}>
              ${(project.budget || 0).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">TOTAL SPRINTS / TASKS</Typography>
            <Typography variant="h6" fontWeight={700} color="#0F172A" sx={{ mt: 0.5 }}>
              {milestones.length} Sprints / {tasks.length} Tasks
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab label="Overview & Architecture" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Sprints & Milestones (${milestones.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Task Board (${tasks.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Time Logs (${timeLogs.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Deployment Handovers (${handovers.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Tab 0: Overview */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Scope & Architectural Specifications
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {project.description || 'No detailed architecture description provided yet.'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Active Tech Stack Frameworks
              </Typography>
              {techStackList.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {techStackList.map((tech, idx) => (
                    <Chip
                      key={idx}
                      icon={<CodeIcon />}
                      label={tech}
                      sx={{ bgcolor: '#F1F5F9', color: '#1E293B', fontWeight: 600, px: 0.5, py: 2 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No tech stack tags recorded.</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Project Governance
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">PROJECT MANAGER</Typography>
                  <Typography variant="body1" fontWeight={600} color="#1E293B">
                    {project.projectManager ? project.projectManager.fullName : 'Not Assigned'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">DELIVERY MANAGER</Typography>
                  <Typography variant="body1" fontWeight={600} color="#1E293B">
                    {project.deliveryManager ? project.deliveryManager.fullName : 'Not Assigned'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">START DATE</Typography>
                  <Typography variant="body1" fontWeight={600} color="#1E293B">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Immediate'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">TARGET DEADLINE</Typography>
                  <Typography variant="body1" fontWeight={600} color="#1E293B">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Open Milestone'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Sprints & Milestones */}
      {activeTab === 1 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="h6" fontWeight={700}>Agile Sprints & Milestones</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setMilestoneModalOpen(true)}
              sx={{ bgcolor: '#2563EB', textTransform: 'none', borderRadius: 2 }}
            >
              Add Sprint / Milestone
            </Button>
          </Stack>

          {milestones.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
              <FlagIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h6" color="#334155">No Sprints Defined</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Organize work into structured delivery sprints and milestone checkpoints.
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setMilestoneModalOpen(true)}>
                Create First Sprint
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {milestones.map((m) => (
                <Paper key={m.id} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="#0F172A">
                          {m.title}
                        </Typography>
                        <Chip label={m.milestoneType} size="small" sx={{ fontSize: '0.7rem' }} />
                        <Chip
                          label={m.status}
                          size="small"
                          color={m.status === 'COMPLETED' ? 'success' : 'primary'}
                          sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {m.description || 'Sprint deliverables and backlog execution.'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'TBD'}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Tab 2: Task Board */}
      {activeTab === 2 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="h6" fontWeight={700}>Project Task Backlog</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setTaskModalOpen(true)}
              sx={{ bgcolor: '#2563EB', textTransform: 'none', borderRadius: 2 }}
            >
              Add Task
            </Button>
          </Stack>

          {tasks.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
              <AssignmentIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h6" color="#334155">No Tasks Found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create features, bug fixes, or tasks to track work progress.
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setTaskModalOpen(true)}>
                Add First Task
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Task</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Hours (Est / Act)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Assignee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#1E293B">
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="caption" color="text.secondary">
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={task.taskType} size="small" sx={{ fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: task.priority === 'CRITICAL' ? '#FEE2E2' : '#F1F5F9',
                            color: task.priority === 'CRITICAL' ? '#991B1B' : '#475569'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={task.status}
                          onChange={(e) => updateTaskMutation.mutate({ taskId: task.id, data: { status: e.target.value } })}
                          sx={{ fontSize: '0.75rem', height: 28 }}
                        >
                          <MenuItem value="TODO">To Do</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="IN_REVIEW">In Review</MenuItem>
                          <MenuItem value="QA">QA</MenuItem>
                          <MenuItem value="DONE">Done</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight={600}>
                          {task.estimatedHours || 0}h / {task.actualHours || 0}h
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {task.assignedTo ? task.assignedTo.fullName : 'Unassigned'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Tab 3: Time Tracking */}
      {activeTab === 3 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Typography variant="h6" fontWeight={700}>Logged Development Time</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AccessTimeIcon />}
              onClick={() => setTimeLogModalOpen(true)}
              sx={{ bgcolor: '#2563EB', textTransform: 'none', borderRadius: 2 }}
            >
              Log Work Time
            </Button>
          </Stack>

          {timeLogs.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h6" color="#334155">No Time Logs Recorded</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Record billable developer hours against this project.
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setTimeLogModalOpen(true)}>
                Log Hours
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Developer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeLogs.map((log) => {
                    const isOwner = currentUser?.id === log.userId;
                    const canDelete = isOwner || isAdmin || currentUser?.role === 'super_admin';

                    return (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {log.user ? log.user.fullName : 'Staff'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(log.workDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="#2563EB">
                            {log.hours} hrs
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.description || 'Sprint task implementation.'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.isBillable ? 'Billable' : 'Internal'}
                            size="small"
                            color={log.isBillable ? 'success' : 'default'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {canDelete && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteTimeLogMutation.mutate(log.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Tab 4: Deployment & Handovers */}
      {activeTab === 4 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Quality Assurance, Staging & Handover Sign-offs
          </Typography>

          {handovers.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
              <RocketLaunchIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1 }} />
              <Typography variant="h6" color="#334155">No Handover Milestones</Typography>
              <Typography variant="body2" color="text.secondary">
                Track QA verification gates, client UAT acceptance, and production release sign-offs.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {handovers.map((h) => (
                <Paper key={h.id} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Stage: {h.stage}
                        </Typography>
                        <Chip
                          label={h.status}
                          size="small"
                          color={h.status === 'SIGNED_OFF' || h.status === 'PASSED' ? 'success' : 'warning'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {h.releaseNotes || 'Verification gate sign-off.'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Signed Off By: {h.signOffByName || (h.signedOffBy ? h.signedOffBy.fullName : 'Pending')}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Task Creation Modal */}
      <Dialog
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={(e) => { e.preventDefault(); createTaskMutation.mutate(taskForm); }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Task to Project</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                size="small"
                label="Task Title"
                placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={taskForm.taskType}
                      label="Type"
                      onChange={(e) => setTaskForm({ ...taskForm, taskType: e.target.value })}
                    >
                      <MenuItem value="FEATURE">Feature</MenuItem>
                      <MenuItem value="BUG">Bug</MenuItem>
                      <MenuItem value="TASK">Task</MenuItem>
                      <MenuItem value="QA">QA Testing</MenuItem>
                      <MenuItem value="DEPLOYMENT">Deployment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={taskForm.priority}
                      label="Priority"
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    >
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="CRITICAL">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Estimated Hours"
                placeholder="4"
                value={taskForm.estimatedHours}
                onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Task Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setTaskModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#2563EB', borderRadius: 2 }}>
              Add Task
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Log Time Modal */}
      <Dialog
        open={timeLogModalOpen}
        onClose={() => setTimeLogModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={(e) => { e.preventDefault(); logTimeMutation.mutate(timeLogForm); }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Log Development Time</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="number"
                    step="0.25"
                    label="Hours Logged"
                    placeholder="3.5"
                    value={timeLogForm.hours}
                    onChange={(e) => setTimeLogForm({ ...timeLogForm, hours: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="date"
                    label="Work Date"
                    InputLabelProps={{ shrink: true }}
                    value={timeLogForm.workDate}
                    onChange={(e) => setTimeLogForm({ ...timeLogForm, workDate: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="Work Description"
                placeholder="What was completed during this development session..."
                value={timeLogForm.description}
                onChange={(e) => setTimeLogForm({ ...timeLogForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setTimeLogModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#2563EB', borderRadius: 2 }}>
              Save Time Log
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Milestone Modal */}
      <Dialog
        open={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={(e) => { e.preventDefault(); createMilestoneMutation.mutate(milestoneForm); }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Create Sprint / Milestone</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                size="small"
                label="Sprint / Milestone Title"
                placeholder="Sprint 1: Core API & Auth"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={milestoneForm.startDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, startDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Target Due Date"
                    InputLabelProps={{ shrink: true }}
                    value={milestoneForm.dueDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Milestone Objective"
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setMilestoneModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#2563EB', borderRadius: 2 }}>
              Create Milestone
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;
