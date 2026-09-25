import { asyncHandler } from '../utils/asyncHandler.js';
import * as requestsService from '../services/requests.service.js';

export const createRequest = asyncHandler(async (req, res) => {
  const request = await requestsService.createRequest({
    requesterId: req.user.id,
    body: req.body,
  });

  res.status(201).json({
    success: true,
    data: { request },
  });
});

// GET /api/v1/requests?blood_group=&city=&urgency=
export const listRequests = asyncHandler(async (req, res) => {
  const requests = await requestsService.listRequests({
    bloodGroup: req.query.blood_group,
    city: req.query.city,
    urgency: req.query.urgency,
  });

  res.status(200).json({
    success: true,
    data: { requests },
  });
});