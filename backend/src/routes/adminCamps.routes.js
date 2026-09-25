import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminCamps.controller.js';

const router = Router();

router.use(
  '/admin/camps',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/camps', controller.listCamps);
router.post('/admin/camps', controller.createCamp);
router.patch('/admin/camps/:id', controller.updateCamp);
router.post('/admin/camps/:id/status', controller.changeStatus);

export default router;