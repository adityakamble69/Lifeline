import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import * as meController from '../controllers/me.controller.js';

const router = Router();

router.use('/me', requireAuth);

router.get('/me', meController.getMyProfile);
router.patch('/me', meController.updateMyUser);
router.patch('/me/donor', meController.updateMyDonor);
router.get('/me/stats', meController.getMyStats);
router.get('/me/donations', meController.getMyDonations);
router.get('/me/camps', meController.getMyUpcomingCamps);

// Notifications
router.get('/me/notifications', meController.getMyNotifications);
router.patch(
  '/me/notifications/read-all',
  meController.markAllNotificationsRead,
);
router.patch(
  '/me/notifications/:id/read',
  meController.markNotificationRead,
);

export default router;