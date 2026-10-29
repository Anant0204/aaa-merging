const prisma = require('../config/db');

/**
 * Determine sentiment based on rating and text keywords
 */
const analyzeSentiment = (rating, text = '') => {
  const lower = (text || '').toLowerCase();
  const positiveWords = ['great', 'excellent', 'amazing', 'superb', 'best', 'outstanding', 'fantastic', 'fast', 'delivered', 'recommend', 'professional', 'happy', 'pleasure'];
  const negativeWords = ['terrible', 'worst', 'horrible', 'delay', 'bad', 'poor', 'buggy', 'failed', 'unprofessional', 'disappointed', 'late', 'waste', 'issue', 'broken'];

  let posScore = 0;
  let negScore = 0;
  positiveWords.forEach(w => { if (lower.includes(w)) posScore++; });
  negativeWords.forEach(w => { if (lower.includes(w)) negScore++; });

  if (rating >= 4) {
    return negScore > posScore + 1 ? 'NEUTRAL' : 'POSITIVE';
  } else if (rating <= 2) {
    return posScore > negScore + 1 ? 'NEUTRAL' : 'NEGATIVE';
  } else {
    if (posScore > negScore) return 'POSITIVE';
    if (negScore > posScore) return 'NEGATIVE';
    return 'NEUTRAL';
  }
};

/**
 * Generate AI-assisted / professional reply draft based on rating, source, and sentiment
 */
const generateReplyDraft = ({ authorName, rating, sentiment, source }) => {
  const name = authorName || 'Valued Client';

  if (sentiment === 'POSITIVE' || rating >= 4) {
    return `Thank you so much, ${name}, for your stellar ${rating}-star review on ${source}! Our engineering and delivery team was thrilled to partner with you. We look forward to supporting your continued digital growth and future milestones!`;
  } else if (sentiment === 'NEGATIVE' || rating <= 2) {
    return `Dear ${name}, thank you for bringing this to our attention. At our IT firm, client satisfaction and high software delivery standards are our highest priorities. We would like to connect directly to address your concerns and make things right. Please reach out to our delivery director at delivery@aaaitconsultancy.com so we can resolve this promptly.`;
  } else {
    return `Hello ${name}, thank you for sharing your balanced feedback on ${source}. We appreciate your insights and are constantly refining our project delivery and communication practices. If you have any further suggestions, please feel free to reach out to us!`;
  }
};

/**
 * Ingest or sync a single review with deduplication
 */
const ingestReview = async ({
  source,
  externalReviewId,
  authorName,
  authorEmail,
  authorCompany,
  rating,
  reviewText,
  projectId,
  clientId
}) => {
  if (!source || !authorName || rating === undefined) {
    throw new Error('source, authorName, and rating are required fields.');
  }

  const validSources = ['GOOGLE', 'CLUTCH', 'TRUSTPILOT', 'WEBSITE'];
  const normalizedSource = source.toUpperCase();
  if (!validSources.includes(normalizedSource)) {
    throw new Error(`Invalid review source: ${source}. Must be one of: ${validSources.join(', ')}`);
  }

  const parsedRating = Math.max(1, Math.min(5, parseFloat(rating)));
  const sentiment = analyzeSentiment(parsedRating, reviewText);
  const responseDraft = generateReplyDraft({ authorName, rating: parsedRating, sentiment, source: normalizedSource });

  // Deduplication check
  if (externalReviewId) {
    const existing = await prisma.review.findUnique({
      where: {
        source_externalReviewId: {
          source: normalizedSource,
          externalReviewId
        }
      }
    });

    if (existing) {
      console.log(`[ReviewService] Duplicate review skipped: ${normalizedSource} / ${externalReviewId}`);
      return { skipped: true, review: existing, reason: 'Duplicate externalReviewId' };
    }
  }

  const created = await prisma.review.create({
    data: {
      source: normalizedSource,
      externalReviewId: externalReviewId || `rev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      authorName,
      authorEmail: authorEmail || null,
      authorCompany: authorCompany || null,
      rating: parsedRating,
      reviewText: reviewText || '',
      sentiment,
      responseDraft,
      status: 'PENDING_REPLY',
      projectId: projectId || null,
      clientId: clientId || null
    }
  });

  return { skipped: false, review: created };
};

/**
 * Ingest batch of reviews (e.g. from Clutch, Google Places, or Trustpilot webhook/sync)
 */
const ingestBatchReviews = async (reviewsArray) => {
  const results = {
    total: reviewsArray.length,
    ingested: 0,
    skipped: 0,
    items: []
  };

  for (const item of reviewsArray) {
    try {
      const res = await ingestReview(item);
      if (res.skipped) {
        results.skipped++;
      } else {
        results.ingested++;
      }
      results.items.push(res.review);
    } catch (err) {
      console.warn('[ReviewService: Batch Ingestion Error]:', err.message);
      results.skipped++;
    }
  }

  return results;
};

/**
 * Get review statistics & sentiment analytics
 */
const getReviewAnalytics = async () => {
  const totalReviews = await prisma.review.count();
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      bySource: {},
      bySentiment: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 },
      pendingRepliesCount: 0
    };
  }

  const allReviews = await prisma.review.findMany({
    select: { rating: true, source: true, sentiment: true, status: true }
  });

  let sumRating = 0;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const bySource = {};
  const bySentiment = { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 };
  let pendingRepliesCount = 0;

  for (const r of allReviews) {
    sumRating += r.rating;
    const roundedRating = Math.round(r.rating);
    if (distribution[roundedRating] !== undefined) distribution[roundedRating]++;

    bySource[r.source] = (bySource[r.source] || 0) + 1;
    if (bySentiment[r.sentiment] !== undefined) bySentiment[r.sentiment]++;
    if (r.status === 'PENDING_REPLY') pendingRepliesCount++;
  }

  const averageRating = parseFloat((sumRating / totalReviews).toFixed(2));

  return {
    totalReviews,
    averageRating,
    distribution,
    bySource,
    bySentiment,
    pendingRepliesCount
  };
};

module.exports = {
  analyzeSentiment,
  generateReplyDraft,
  ingestReview,
  ingestBatchReviews,
  getReviewAnalytics
};
