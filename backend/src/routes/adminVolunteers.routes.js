import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminVolunteers.controller.js';

const router = Router();

router.use(
  '/admin/camps/volunteers',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/camps/volunteers', controller.listVolunteers);
router.patch('/admin/camps/volunteers/:id', controller.updateVolunteer);

export default router;