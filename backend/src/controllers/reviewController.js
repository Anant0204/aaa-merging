const prisma = require('../config/db');
const {
  ingestReview,
  ingestBatchReviews,
  getReviewAnalytics,
  generateReplyDraft
} = require('../services/reviewService');

/**
 * GET /api/v1/reviews
 * List reviews with filtering and pagination
 */
exports.getReviews = async (req, res) => {
  try {
    const { source, sentiment, rating, status, search } = req.query;

    const where = {};
    if (source && source !== 'ALL') where.source = source.toUpperCase();
    if (sentiment && sentiment !== 'ALL') where.sentiment = sentiment.toUpperCase();
    if (status && status !== 'ALL') where.status = status.toUpperCase();
    if (rating && !isNaN(rating)) where.rating = parseFloat(rating);

    if (search) {
      where.OR = [
        { authorName: { contains: search } },
        { reviewText: { contains: search } },
        { authorCompany: { contains: search } }
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        project: { select: { id: true, name: true, projectCode: true } },
        client: { select: { id: true, firstName: true, lastName: true, email: true } },
        respondedBy: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('[ReviewController: getReviews] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.', error: error.message });
  }
};

/**
 * GET /api/v1/reviews/analytics
 * Retrieve review reputation analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getReviewAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('[ReviewController: getAnalytics] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate review analytics.', error: error.message });
  }
};

/**
 * POST /api/v1/reviews/ingest
 * Ingest a single review (manual or webhook)
 */
exports.ingestSingleReview = async (req, res) => {
  try {
    const result = await ingestReview(req.body);
    res.status(result.skipped ? 200 : 201).json({
      success: true,
      message: result.skipped ? 'Duplicate review skipped.' : 'Review ingested successfully.',
      data: result.review,
      skipped: result.skipped
    });
  } catch (error) {
    console.error('[ReviewController: ingestSingleReview] Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/reviews/batch-sync
 * Ingest batch reviews from third-party sync (Clutch, Google Places, Trustpilot)
 */
exports.batchSyncReviews = async (req, res) => {
  try {
    const { reviews } = req.body;
    if (!Array.isArray(reviews)) {
      return res.status(400).json({ success: false, message: 'reviews must be an array of review objects.' });
    }

    const result = await ingestBatchReviews(reviews);
    res.json({ success: true, message: `Batch sync complete: ${result.ingested} ingested, ${result.skipped} skipped.`, data: result });
  } catch (error) {
    console.error('[ReviewController: batchSyncReviews] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync batch reviews.', error: error.message });
  }
};

/**
 * PUT /api/v1/reviews/:id/draft-reply
 * Update or regenerate draft reply
 */
exports.updateDraftReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseDraft, regenerate } = req.body;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    let updatedDraft = responseDraft;
    if (regenerate) {
      updatedDraft = generateReplyDraft({
        authorName: review.authorName,
        rating: review.rating,
        sentiment: review.sentiment,
        source: review.source
      });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { responseDraft: updatedDraft }
    });

    res.json({ success: true, message: 'Draft reply updated.', data: updated });
  } catch (error) {
    console.error('[ReviewController: updateDraftReply] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update draft reply.', error: error.message });
  }
};

/**
 * POST /api/v1/reviews/:id/publish-reply
 * Authorize and publish reply
 */
exports.publishReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { publishedResponse } = req.body;
    const userId = req.user?.id;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const finalResponse = publishedResponse || review.responseDraft;
    if (!finalResponse || !finalResponse.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty.' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        publishedResponse: finalResponse,
        status: 'REPLIED',
        respondedAt: new Date(),
        respondedById: userId || null
      },
      include: {
        respondedBy: { select: { id: true, fullName: true, email: true } }
      }
    });

    console.log(`[ReviewController] Published authorized reply to review #${id} (${review.source})`);
    res.json({ success: true, message: 'Reply successfully published and logged.', data: updated });
  } catch (error) {
    console.error('[ReviewController: publishReply] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish review reply.', error: error.message });
  }
};

/**
 * DELETE /api/v1/reviews/:id
 * Delete a review (Admin / Super Admin only)
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('[ReviewController: deleteReview] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review.', error: error.message });
  }
};
