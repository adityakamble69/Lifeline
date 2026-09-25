import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import * as campsController from '../controllers/camps.controller.js';

const router = Router();

// Public
router.get('/camps', campsController.listCamps);
router.get('/camps/:id', campsController.getCampDetail);

// Auth required
router.post('/camps/:id/register', requireAuth, campsController.registerForCamp);

export default router;