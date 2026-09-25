import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminFeedback.controller.js';

const router = Router();

router.use(
  '/admin/camps/feedback',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/camps/feedback', controller.listFeedback);

export default router;