import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminRequests.controller.js';

const router = Router();

router.use(
  '/admin/requests',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/requests', controller.listRequests);
router.post('/admin/requests/:id/verify', controller.verifyRequest);
router.post('/admin/requests/:id/reject', controller.rejectRequest);
router.post('/admin/requests/:id/fulfill', controller.markFulfilled);
router.post('/admin/requests/:id/in-progress', controller.setInProgress);

export default router;