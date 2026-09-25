import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import * as controller from '../controllers/adminNotifications.controller.js';

const router = Router();

router.use('/admin/notifications', requireAuth, requireRole('admin'));

router.get('/admin/notifications', controller.listNotifications);
router.patch('/admin/notifications/read-all', controller.markAllRead);
router.delete('/admin/notifications/clear-read', controller.deleteAllRead);
router.patch('/admin/notifications/:id/read', controller.markRead);
router.delete('/admin/notifications/:id', controller.deleteOne);

export default router;