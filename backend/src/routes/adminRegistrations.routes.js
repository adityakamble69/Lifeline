import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminRegistrations.controller.js';

const router = Router();

router.use(
  '/admin/camps/registrations',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/camps/registrations', controller.listRegistrations);
router.post(
  '/admin/camps/registrations/:id/status',
  controller.changeStatus,
);

export default router;