import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import AddIcon from '@mui/icons-material/Add';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { dbService } from '../../../services/dbService';
import { useAlert } from '../../../contexts/AlertContext';
import QrPrintModal from './QrPrintModal';

export const QrCodeManagementTab = ({ businessSettings }) => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    codeLabel: '',
    locationName: '',
    campaignName: '',
    customSlug: '',
    googleReviewUrl: ''
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeCodeForEdit, setActiveCodeForEdit] = useState(null);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [activeCodeForPrint, setActiveCodeForPrint] = useState(null);

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [activeCodeForPreview, setActiveCodeForPreview] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);

  // Queries
  const { data: qrResponse, isLoading, refetch } = useQuery({
    queryKey: ['qr-codes', page, rowsPerPage, searchTerm, statusFilter],
    queryFn: () => dbService.getQrCodes({
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined
    })
  });

  const qrCodes = qrResponse?.qrCodes || [];
  const totalCodes = qrResponse?.total || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => dbService.createQrCode(data),
    onSuccess: (res) => {
      showAlert('Smart QR Code created successfully.', 'success');
      setCreateDialogOpen(false);
      setCreateForm({ codeLabel: '', locationName: '', campaignName: '', customSlug: '', googleReviewUrl: '' });
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      queryClient.invalidateQueries({ queryKey: ['qr-analytics'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to create QR code.', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => dbService.updateQrCode(id, data),
    onSuccess: () => {
      showAlert('QR Code updated successfully.', 'success');
      setEditDialogOpen(false);
      setActiveCodeForEdit(null);
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to update QR code.', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => dbService.deleteQrCode(id),
    onSuccess: () => {
      showAlert('QR Code deleted successfully.', 'success');
      setDeleteConfirmOpen(false);
      setCodeToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      queryClient.invalidateQueries({ queryKey: ['qr-analytics'] });
    },
    onError: (err) => {
      showAlert(err.response?.data?.message || 'Failed to delete QR code.', 'error');
    }
  });

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    showAlert('Direct review link copied to clipboard!', 'info');
  };

  const handleOpenPrint = async (code) => {
    try {
      const detailed = await dbService.getQrCodeById(code.id);
      setActiveCodeForPrint(detailed.qrCode);
      setPrintModalOpen(true);
    } catch {
      showAlert('Could not generate print preview.', 'error');
    }
  };

  const handleOpenPreview = async (code) => {
    try {
      const detailed = await dbService.getQrCodeById(code.id);
      setActiveCodeForPreview(detailed.qrCode);
      setPreviewDialogOpen(true);
    } catch {
      showAlert('Could not load QR preview.', 'error');
    }
  };

  const handleOpenEdit = (code) => {
    setActiveCodeForEdit({ ...code });
    setEditDialogOpen(true);
  };

  const handleToggleStatus = (code) => {
    updateMutation.mutate({
      id: code.id,
      data: { isActive: !code.isActive }
    });
  };

  return (
    <Box>
      {/* 1. Header & Actions Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 260 }}>
            <TextField
              size="small"
              placeholder="Search table, location, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ maxWidth: 360, width: '100%' }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                size="small"
                clickable
                color={statusFilter === 'ALL' ? 'primary' : 'default'}
                onClick={() => setStatusFilter('ALL')}
              />
              <Chip
                label="Active"
                size="small"
                clickable
                color={statusFilter === 'active' ? 'primary' : 'default'}
                onClick={() => setStatusFilter('active')}
              />
              <Chip
                label="Inactive"
                size="small"
                clickable
                color={statusFilter === 'inactive' ? 'primary' : 'default'}
                onClick={() => setStatusFilter('inactive')}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            + Create Smart QR Code
          </Button>
        </Box>
      </Paper>

      {/* 2. QR Codes Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Table / Location Label</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug & Link</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Branch / Location</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Scans</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Google Clicks</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Feedback</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading QR codes...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : qrCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <QrCode2Icon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155' }}>
                      No Smart QR Codes Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Create unique QR codes for your tables, counters, or branches to collect reviews.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create First QR Code
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                qrCodes.map((code) => (
                  <TableRow key={code.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            backgroundColor: '#EFF6FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563EB',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleOpenPreview(code)}
                        >
                          <QrCode2Icon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                            {code.codeLabel}
                          </Typography>
                          {code.campaignName && (
                            <Typography variant="caption" color="text.secondary">
                              Campaign: {code.campaignName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#0369A1' }}>
                          /r/{code.slug}
                        </Typography>
                        <Tooltip title="Copy Public Review URL">
                          <IconButton size="small" onClick={() => handleCopyLink(code.publicUrl)}>
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {code.locationName || 'General / Unspecified'}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={code.scanCount} size="small" sx={{ fontWeight: 700, backgroundColor: '#F1F5F9' }} />
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={code.googleReviewClicks} size="small" color="primary" sx={{ fontWeight: 700 }} />
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={code.feedbackSubmissions} size="small" color="success" sx={{ fontWeight: 700 }} />
                    </TableCell>

                    <TableCell align="center">
                      {code.isActive ? (
                        <Chip
                          label="ACTIVE"
                          size="small"
                          color="success"
                          icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      ) : (
                        <Chip
                          label="INACTIVE"
                          size="small"
                          color="default"
                          icon={<BlockIcon sx={{ fontSize: '12px !important' }} />}
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Preview & Live Mockup">
                          <IconButton size="small" onClick={() => handleOpenPreview(code)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Print Table Tent Card">
                          <IconButton size="small" color="primary" onClick={() => handleOpenPrint(code)}>
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Download Scalable SVG">
                          <IconButton
                            size="small"
                            component="a"
                            href={dbService.downloadQrSvg(code.id)}
                            download={`qr-${code.slug}.svg`}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Labels & Location">
                          <IconButton size="small" onClick={() => handleOpenEdit(code)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete QR Code">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setCodeToDelete(code);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCodes}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* 3. Create QR Code Modal */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Smart QR Code</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Table / Location Label *"
              placeholder="e.g. Table 12, Billing Counter, Dr. Office"
              value={createForm.codeLabel}
              onChange={(e) => setCreateForm({ ...createForm, codeLabel: e.target.value })}
              fullWidth
              size="small"
              required
            />

            <TextField
              label="Branch / Location Name"
              placeholder="e.g. Downtown Grill, Westside Clinic"
              value={createForm.locationName}
              onChange={(e) => setCreateForm({ ...createForm, locationName: e.target.value })}
              fullWidth
              size="small"
            />

            <TextField
              label="Campaign Tag (Optional)"
              placeholder="e.g. Summer Promo, Weekend Brunch"
              value={createForm.campaignName}
              onChange={(e) => setCreateForm({ ...createForm, campaignName: e.target.value })}
              fullWidth
              size="small"
            />

            <TextField
              label="Custom URL Slug (Optional)"
              placeholder="e.g. tbl-12 (letters, numbers, hyphens only)"
              value={createForm.customSlug}
              onChange={(e) => setCreateForm({ ...createForm, customSlug: e.target.value })}
              helperText="Leave blank to auto-generate a clean, unique link."
              fullWidth
              size="small"
            />

            <TextField
              label="Google Review URL Override (Optional)"
              placeholder="Leave blank to use default Google review URL from settings"
              value={createForm.googleReviewUrl}
              onChange={(e) => setCreateForm({ ...createForm, googleReviewUrl: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => createMutation.mutate(createForm)}
            disabled={!createForm.codeLabel.trim() || createMutation.isPending}
            sx={{ fontWeight: 700 }}
          >
            {createMutation.isPending ? 'Generating...' : 'Create & Generate QR'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 4. Edit QR Code Modal */}
      {activeCodeForEdit && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Edit Smart QR Code</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Table / Location Label"
                value={activeCodeForEdit.codeLabel}
                onChange={(e) => setActiveCodeForEdit({ ...activeCodeForEdit, codeLabel: e.target.value })}
                fullWidth
                size="small"
              />

              <TextField
                label="Branch / Location"
                value={activeCodeForEdit.locationName || ''}
                onChange={(e) => setActiveCodeForEdit({ ...activeCodeForEdit, locationName: e.target.value })}
                fullWidth
                size="small"
              />

              <TextField
                label="Campaign Tag"
                value={activeCodeForEdit.campaignName || ''}
                onChange={(e) => setActiveCodeForEdit({ ...activeCodeForEdit, campaignName: e.target.value })}
                fullWidth
                size="small"
              />

              <TextField
                label="Google Review URL Override"
                value={activeCodeForEdit.googleReviewUrl || ''}
                onChange={(e) => setActiveCodeForEdit({ ...activeCodeForEdit, googleReviewUrl: e.target.value })}
                fullWidth
                size="small"
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Active Status
                </Typography>
                <Button
                  size="small"
                  variant={activeCodeForEdit.isActive ? 'contained' : 'outlined'}
                  color={activeCodeForEdit.isActive ? 'success' : 'default'}
                  onClick={() => setActiveCodeForEdit({ ...activeCodeForEdit, isActive: !activeCodeForEdit.isActive })}
                >
                  {activeCodeForEdit.isActive ? 'Active' : 'Deactivated'}
                </Button>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateMutation.mutate({
                id: activeCodeForEdit.id,
                data: {
                  codeLabel: activeCodeForEdit.codeLabel,
                  locationName: activeCodeForEdit.locationName,
                  campaignName: activeCodeForEdit.campaignName,
                  googleReviewUrl: activeCodeForEdit.googleReviewUrl,
                  isActive: activeCodeForEdit.isActive
                }
              })}
              disabled={updateMutation.isPending}
              sx={{ fontWeight: 700 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* 5. Preview Dialog */}
      {activeCodeForPreview && (
        <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 800 }}>
            {activeCodeForPreview.codeLabel}
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', p: 3 }}>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#FFFFFF',
                borderRadius: 3,
                display: 'inline-block',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                mb: 2,
                '& svg': { width: 200, height: 200, display: 'block' }
              }}
              dangerouslySetInnerHTML={{ __html: activeCodeForPreview.svgData || '' }}
            />

            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0369A1', mb: 1 }}>
              {activeCodeForPreview.publicUrl}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Scans: {activeCodeForPreview.scanCount} • Google Clicks: {activeCodeForPreview.googleReviewClicks} • Feedback: {activeCodeForPreview.feedbackSubmissions}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => handleCopyLink(activeCodeForPreview.publicUrl)}
            >
              Copy Link
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => {
                setPreviewDialogOpen(false);
                handleOpenPrint(activeCodeForPreview);
              }}
            >
              Print Tent Card
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* 6. Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Smart QR Code?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{codeToDelete?.codeLabel}</strong>?
            Any physical stickers printed with this QR code will stop resolving. Existing historical feedback and complaints will remain preserved.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(codeToDelete.id)}
            disabled={deleteMutation.isPending}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* 7. Printable Tent Card Modal */}
      <QrPrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        qrCode={activeCodeForPrint}
        businessSettings={businessSettings}
      />
    </Box>
  );
};

export default QrCodeManagementTab;
