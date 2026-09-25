import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminVolunteers.service.js';

// GET /api/v1/admin/camps/volunteers
export const listVolunteers = asyncHandler(async (req, res) => {
  const [data, stats] = await Promise.all([
    service.listVolunteers({
      search: req.query.search,
      role: req.query.role,
      status: req.query.status,
      city: req.query.city,
      page: req.query.page,
      pageSize: req.query.page_size,
    }),
    service.getStats(),
  ]);

  res.status(200).json({ success: true, data: { ...data, stats } });
});

// PATCH /api/v1/admin/camps/volunteers/:id
export const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await service.updateVolunteer({
    volunteerId: req.params.id,
    body: req.body,
  });
  res.status(200).json({ success: true, data: { volunteer } });
});