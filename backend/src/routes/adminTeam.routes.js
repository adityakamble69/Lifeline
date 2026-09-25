import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as controller from '../controllers/adminTeam.controller.js';

const router = Router();

router.use(
  '/admin/team',
  requireAuth,
  requireRole('admin'),
  requireOrg(),
);

router.get('/admin/team', controller.listMembers);
router.post('/admin/team', controller.addMember);
router.patch('/admin/team/:id', controller.updateMember);
router.delete('/admin/team/:id', controller.removeMember);

export default router;