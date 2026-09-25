import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/dashboard.controller.js';

const router = Router();

router.use(
  '/admin/dashboard',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/dashboard/stats', controller.getStats);
router.get('/admin/dashboard/activity', controller.getActivity);

export default router;