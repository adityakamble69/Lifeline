import { asyncHandler } from '../utils/asyncHandler.js';
import * as campsService from '../services/camps.service.js';

// GET /api/v1/camps  (public)
export const listCamps = asyncHandler(async (req, res) => {
  const camps = await campsService.listCamps({
    city: req.query.city,
    status: req.query.status,
  });

  res.status(200).json({
    success: true,
    data: { camps },
  });
});

// GET /api/v1/camps/:id  (public)
export const getCampDetail = asyncHandler(async (req, res) => {
  const camp = await campsService.getCampDetail(req.params.id);

  res.status(200).json({
    success: true,
    data: { camp },
  });
});

// POST /api/v1/camps/:id/register  (auth required)
export const registerForCamp = asyncHandler(async (req, res) => {
  const registration = await campsService.registerForCamp({
    campId: req.params.id,
    userId: req.user.id,
    body: req.body,
  });

  res.status(201).json({
    success: true,
    data: { registration },
  });
});