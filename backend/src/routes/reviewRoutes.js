const express = require('express');
const { authMiddleware, rbacMiddleware } = require('../middlewares/authMiddleware');
const {
  getReviews,
  getAnalytics,
  ingestSingleReview,
  batchSyncReviews,
  updateDraftReply,
  publishReply,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

// Public/Webhook ingestion endpoint
router.post('/ingest', ingestSingleReview);

// Protected routes
router.use(authMiddleware);

router.get('/', getReviews);
router.get('/analytics', getAnalytics);
router.post('/batch-sync', rbacMiddleware(['admin', 'super_admin', 'marketing']), batchSyncReviews);
router.put('/:id/draft-reply', rbacMiddleware(['admin', 'super_admin', 'marketing', 'consultant']), updateDraftReply);
router.post('/:id/publish-reply', rbacMiddleware(['admin', 'super_admin', 'marketing']), publishReply);
router.delete('/:id', rbacMiddleware(['admin', 'super_admin']), deleteReview);

module.exports = router;
