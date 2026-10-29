import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import dayjs from 'dayjs';

import { dbService } from '../../../services/dbService';
import { useAlert } from '../../../contexts/AlertContext';

export const ComplaintsTab = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Detail & Resolution Modal
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const { data: complaintsResponse, isLoading } = useQuery({
    queryKey: ['qr-complaints', page, rowsPerPage, searchTerm, statusFilter, priorityFilter],
    queryFn: () => dbService.getQrComplaints({
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      priority: priorityFilter !== 'ALL' ? priorityFilter : undefined
    })
  });

  const complaints = complaintsResponse?.complaints || [];
  const total = complaintsResponse?.total || 0;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => dbService.updateQrComplaint(id, data),
    onSuccess: () => {
      showAlert('Complaint status updated successfully.', 'success');
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['qr-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['qr-analytics'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to update complaint.', 'error');
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, text }) => dbService.addQrComplaintNote(id, text),
    onSuccess: (res) => {
      showAlert('Internal staff note recorded.', 'success');
      setNewNoteText('');
      if (activeComplaint) {
        setActiveComplaint({ ...activeComplaint, internalNotes: res.notes });
      }
      queryClient.invalidateQueries({ queryKey: ['qr-complaints'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to add note.', 'error');
    }
  });

  const handleOpenManage = (comp) => {
    setActiveComplaint(comp);
    setNewStatus(comp.status);
    setNewPriority(comp.priority);
    setResolutionNotes(comp.resolutionNotes || '');
    setNewNoteText('');
    setDialogOpen(true);
  };

  const getPriorityChip = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return <Chip label="CRITICAL" size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />;
      case 'HIGH':
        return <Chip label="HIGH" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', backgroundColor: '#F97316', color: '#FFFFFF' }} />;
      case 'MEDIUM':
        return <Chip label="MEDIUM" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', backgroundColor: '#F59E0B', color: '#FFFFFF' }} />;
      default:
        return <Chip label="LOW" size="small" sx={{ fontWeight: 600, fontSize: '0.65rem', backgroundColor: '#E2E8F0', color: '#475569' }} />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <Chip label="RESOLVED" size="small" color="success" icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />} sx={{ fontWeight: 700, fontSize: '0.68rem' }} />;
      case 'DISMISSED':
        return <Chip label="DISMISSED" size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', backgroundColor: '#E2E8F0', color: '#64748B' }} />;
      case 'IN_PROGRESS':
        return <Chip label="IN PROGRESS" size="small" color="info" icon={<PendingActionsIcon sx={{ fontSize: '12px !important' }} />} sx={{ fontWeight: 700, fontSize: '0.68rem' }} />;
      case 'UNDER_REVIEW':
        return <Chip label="UNDER REVIEW" size="small" color="warning" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />;
      default:
        return <Chip label="OPEN" size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />;
    }
  };

  return (
    <Box>
      {/* 1. Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search ticket number, customer, or issue description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open (Requires Action)</MenuItem>
            <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
            <MenuItem value="DISMISSED">Dismissed</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Priorities</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 2. Complaints Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ticket #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Priority & Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Issue Category & Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location / QR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Reported</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading complaints queue...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CheckCircleIcon sx={{ fontSize: 44, color: '#10B981', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155' }}>
                      All Complaints Addressed!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No unresolved customer complaints found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((comp) => (
                  <TableRow key={comp.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                        {comp.ticketNumber}
                      </Typography>
                      {comp.feedback?.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Rating value={comp.feedback.rating} readOnly size="small" max={comp.feedback.rating} sx={{ color: '#EF4444' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#EF4444' }}>
                            ({comp.feedback.rating}★)
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                        {getPriorityChip(comp.priority)}
                        {getStatusChip(comp.status)}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.3 }}>
                        {comp.issueCategory}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {comp.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                        {comp.customerName || 'Anonymous Customer'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {comp.customerContact || 'No contact details'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {comp.qrCode?.codeLabel || 'General Table'}
                      </Typography>
                      {comp.qrCode?.locationName && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {comp.qrCode.locationName}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {dayjs(comp.createdAt).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                        {dayjs(comp.createdAt).format('h:mm A')}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenManage(comp)}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
                      >
                        Manage & Notes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>

      {/* 3. Manage & Notes Modal */}
      {activeComplaint && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Complaint Ticket: {activeComplaint.ticketNumber}</span>
            <Box>{getPriorityChip(activeComplaint.priority)}</Box>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 3 }}>
            {/* Customer & Issue Summary */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
                Issue Reported: {activeComplaint.issueCategory}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5, color: '#1E293B' }}>
                "{activeComplaint.description}"
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748B' }}>
                <div><strong>Customer:</strong> {activeComplaint.customerName}</div>
                <div><strong>Contact:</strong> {activeComplaint.customerContact}</div>
                <div><strong>Table:</strong> {activeComplaint.qrCode?.codeLabel || 'N/A'}</div>
                <div><strong>Reported:</strong> {dayjs(activeComplaint.createdAt).format('MMM D, YYYY h:mm A')}</div>
              </Box>
            </Box>

            {/* Status & Priority Controls */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              <TextField
                select
                size="small"
                label="Ticket Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="OPEN">Open (Requires Action)</MenuItem>
                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="DISMISSED">Dismissed</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Priority Level"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                fullWidth
              >
                <MenuItem value="CRITICAL">Critical</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </TextField>
            </Box>

            {/* Resolution Summary */}
            <TextField
              label="Resolution Summary (Optional)"
              placeholder="e.g. Spoke with customer, apologized for wait time, and offered a replacement meal."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Internal Staff Notes Timeline */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#1E293B' }}>
              Internal Staff Notes & Activity Log
            </Typography>

            <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Array.isArray(activeComplaint.internalNotes) && activeComplaint.internalNotes.length > 0 ? (
                activeComplaint.internalNotes.map((note) => (
                  <Paper key={note.id} variant="outlined" sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {note.authorName} ({note.authorRole || 'Staff'})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(note.createdAt).format('MMM D, h:mm A')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>
                      {note.text}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                  No internal notes added yet.
                </Typography>
              )}
            </Box>

            {/* Add Note Form */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Type an internal staff note or call update..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<NoteAddIcon />}
                disabled={!newNoteText.trim() || addNoteMutation.isPending}
                onClick={() => addNoteMutation.mutate({ id: activeComplaint.id, text: newNoteText })}
                sx={{ textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Add Note
              </Button>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateMutation.mutate({
                id: activeComplaint.id,
                data: {
                  status: newStatus,
                  priority: newPriority,
                  resolutionNotes
                }
              })}
              disabled={updateMutation.isPending}
              sx={{ fontWeight: 700 }}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Resolution'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ComplaintsTab;

