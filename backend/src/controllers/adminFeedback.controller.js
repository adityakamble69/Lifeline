import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminFeedback.service.js';

// GET /api/v1/admin/camps/feedback
export const listFeedback = asyncHandler(async (req, res) => {
  const [data, stats] = await Promise.all([
    service.listFeedback({
      campId: req.query.camp_id,
      rating: req.query.rating,
      search: req.query.search,
      page: req.query.page,
      pageSize: req.query.page_size,
    }),
    service.getStats(),
  ]);

  res.status(200).json({ success: true, data: { ...data, stats } });
});