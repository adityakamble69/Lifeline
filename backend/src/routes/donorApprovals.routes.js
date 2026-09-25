import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/donorApprovals.controller.js';

const router = Router();

// All admin routes: auth + admin role + org membership
router.use(
  '/admin/donor-approvals',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/donor-approvals', controller.listApprovals);
router.post('/admin/donor-approvals/:id/approve', controller.approveDonor);
router.post('/admin/donor-approvals/:id/reject', controller.rejectDonor);

export default router;