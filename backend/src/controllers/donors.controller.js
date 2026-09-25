import { asyncHandler } from '../utils/asyncHandler.js';
import * as donorsService from '../services/donors.service.js';

// GET /api/v1/donors?blood_group=&city=&availability=
export const searchDonors = asyncHandler(async (req, res) => {
  const donors = await donorsService.searchDonors({
    bloodGroup: req.query.blood_group,
    city: req.query.city,
    availability: req.query.availability,
  });

  res.status(200).json({
    success: true,
    data: { donors },
  });
});

// GET /api/v1/admin/donors
export const listAllDonors = asyncHandler(async (req, res) => {
  const data = await donorsService.listAllDonors({
    search: req.query.search,
    bloodGroup: req.query.blood_group,
    city: req.query.city,
    approvalStatus: req.query.approval_status,
    page: req.query.page,
    pageSize: req.query.page_size,
  });

  res.status(200).json({ success: true, data });
});