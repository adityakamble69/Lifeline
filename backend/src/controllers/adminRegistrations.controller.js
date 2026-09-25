import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminRegistrations.service.js';

// GET /api/v1/admin/camps/registrations
export const listRegistrations = asyncHandler(async (req, res) => {
  const [data, counts, camps] = await Promise.all([
    service.listRegistrations({
      campId: req.query.camp_id,
      status: req.query.status,
      search: req.query.search,
      page: req.query.page,
      pageSize: req.query.page_size,
    }),
    service.getCounts(),
    service.listCampOptions(),
  ]);

  res.status(200).json({
    success: true,
    data: { ...data, counts, camp_options: camps },
  });
});

// POST /api/v1/admin/camps/registrations/:id/status
export const changeStatus = asyncHandler(async (req, res) => {
  const registration = await service.changeStatus({
    registrationId: req.params.id,
    status: req.body?.status,
    attendanceStatus: req.body?.attendance_status,
  });
  res.status(200).json({ success: true, data: { registration } });
});