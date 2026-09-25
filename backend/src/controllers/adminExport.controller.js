import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminExport.service.js';

// GET /api/v1/admin/export/recent
export const listRecent = asyncHandler(async (req, res) => {
  const data = await service.listRecentExports({
    organizationId: req.organization.id,
  });
  res.status(200).json({ success: true, data });
});

// POST /api/v1/admin/export
export const exportData = asyncHandler(async (req, res) => {
  const result = await service.exportData({
    organizationId: req.organization.id,
    userId: req.user.id,
    dataType: req.body?.data_type,
    format: req.body?.format,
    filters: req.body?.filters ?? {},
  });

  res.status(200).json({ success: true, data: result });
});