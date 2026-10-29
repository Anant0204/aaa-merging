import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FeedbackIcon from '@mui/icons-material/Feedback';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';

import { dbService } from '../../../services/dbService';

export const CustomerFeedbackTab = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');

  const { data: feedbackResponse, isLoading } = useQuery({
    queryKey: ['qr-feedbacks', page, rowsPerPage, searchTerm, ratingFilter, sentimentFilter],
    queryFn: () => dbService.getQrFeedbacks({
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm.trim() || undefined,
      rating: ratingFilter !== 'ALL' ? ratingFilter : undefined,
      sentiment: sentimentFilter !== 'ALL' ? sentimentFilter : undefined
    })
  });

  const feedbacks = feedbackResponse?.feedbacks || [];
  const total = feedbackResponse?.total || 0;

  const getSentimentChip = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <Chip label="POSITIVE" size="small" color="success" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />;
      case 'NEGATIVE':
        return <Chip label="NEGATIVE" size="small" color="error" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />;
      default:
        return <Chip label="NEUTRAL" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', backgroundColor: '#E2E8F0', color: '#475569' }} />;
    }
  };

  return (
    <Box>
      {/* 1. Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search customer name, email, comments, or category..."
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
            label="Star Rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars (Excellent)</MenuItem>
            <MenuItem value="4">4 Stars (Good)</MenuItem>
            <MenuItem value="3">3 Stars (Average)</MenuItem>
            <MenuItem value="2">2 Stars (Fair)</MenuItem>
            <MenuItem value="1">1 Star (Poor)</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Sentiment"
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Sentiments</MenuItem>
            <MenuItem value="POSITIVE">Positive</MenuItem>
            <MenuItem value="NEUTRAL">Neutral</MenuItem>
            <MenuItem value="NEGATIVE">Negative</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 2. Feedback Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Rating & Sentiment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Feedback Comments</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Contact</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>QR Table / Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Complaint Ticket</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading customer feedbacks...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <FeedbackIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155' }}>
                      No Customer Feedback Recorded Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When customers scan your QR codes and submit private feedback, it will appear here in real time.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Rating value={item.rating} readOnly size="small" sx={{ color: '#F59E0B' }} />
                        <Box>{getSentimentChip(item.sentiment)}</Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" sx={{ color: item.feedbackText ? '#1E293B' : '#94A3B8', fontStyle: item.feedbackText ? 'normal' : 'italic' }}>
                        {item.feedbackText || 'No written comment provided.'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={item.feedbackCategory || 'General'} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.72rem' }} />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                          {item.customerName || 'Anonymous Customer'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {item.customerEmail || item.customerPhone || 'No contact provided'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {item.qrCode?.codeLabel || 'General QR'}
                      </Typography>
                      {item.qrCode?.locationName && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {item.qrCode.locationName}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {item.complaint ? (
                        <Chip
                          icon={<WarningAmberIcon sx={{ fontSize: '12px !important' }} />}
                          label={item.complaint.ticketNumber}
                          size="small"
                          color={item.complaint.status === 'RESOLVED' ? 'success' : 'warning'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          None (Resolved directly)
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {dayjs(item.createdAt).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                        {dayjs(item.createdAt).format('h:mm A')}
                      </Typography>
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
    </Box>
  );
};

export default CustomerFeedbackTab;

