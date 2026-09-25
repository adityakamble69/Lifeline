import { asyncHandler } from '../utils/asyncHandler.js';
import * as approvalsService from '../services/donorApprovals.service.js';

// GET /api/v1/admin/donor-approvals?status=pending
export const listApprovals = asyncHandler(async (req, res) => {
  const status = req.query.status || 'pending';
  const [approvals, counts] = await Promise.all([
    approvalsService.listApprovals({ status }),
    approvalsService.getApprovalCounts(),
  ]);

  res.status(200).json({
    success: true,
    data: { approvals, counts },
  });
});

// POST /api/v1/admin/donor-approvals/:id/approve
export const approveDonor = asyncHandler(async (req, res) => {
  const result = await approvalsService.approveDonor({
    donorProfileId: req.params.id,
    reviewerId: req.user.id,
  });
  res.status(200).json({ success: true, data: result });
});

// POST /api/v1/admin/donor-approvals/:id/reject
export const rejectDonor = asyncHandler(async (req, res) => {
  const result = await approvalsService.rejectDonor({
    donorProfileId: req.params.id,
    reviewerId: req.user.id,
    reason: req.body?.reason,
  });
  res.status(200).json({ success: true, data: result });
});