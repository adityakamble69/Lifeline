import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminInventory.controller.js';

const router = Router();

router.use(
  '/admin/inventory',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/inventory', controller.listInventory);
router.get('/admin/inventory/transactions', controller.listTransactions);
router.post('/admin/inventory/:id/transaction', controller.recordTransaction);

export default router;