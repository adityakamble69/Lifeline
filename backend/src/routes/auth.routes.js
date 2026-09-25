import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.get('/auth/me', requireAuth, authController.getMe);
router.post('/auth/sync', requireAuth, authController.syncUser);

export default router;