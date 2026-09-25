import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as donorsController from '../controllers/donors.controller.js';

const router = Router();

// Public — donor search
router.get('/donors', donorsController.searchDonors);

// Admin — full donors list
router.get(
  '/admin/donors',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
  donorsController.listAllDonors,
);

export default router;