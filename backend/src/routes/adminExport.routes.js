import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminExport.controller.js';

const router = Router();

router.use(
  '/admin/export',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/export/recent', controller.listRecent);
router.post('/admin/export', controller.exportData);

export default router;