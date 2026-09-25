import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/analytics.controller.js';

const router = Router();

router.use(
  '/admin/analytics',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/analytics', controller.getAnalytics);

export default router;