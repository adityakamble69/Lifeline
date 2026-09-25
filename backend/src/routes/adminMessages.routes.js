import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import * as controller from '../controllers/adminMessages.controller.js';

const router = Router();

router.use('/admin/messages', requireAuth, requireRole('admin'));

router.get('/admin/messages/conversations', controller.listConversations);
router.get('/admin/messages/conversations/:id', controller.getConversation);
router.post(
  '/admin/messages/conversations/:id/messages',
  controller.sendMessage,
);
router.post('/admin/messages/conversations/:id/read', controller.markRead);
router.get('/admin/messages/contact/:userId', controller.getContact);

export default router;