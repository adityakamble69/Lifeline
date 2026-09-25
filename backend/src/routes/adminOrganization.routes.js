import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminOrganization.controller.js';

const router = Router();

router.use(
  '/admin/organization',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/organization', controller.getOrganization);
router.patch('/admin/organization', controller.updateOrganization);

export default router;