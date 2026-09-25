import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireOrg } from '../middleware/requireOrg.js';
import * as orgController from '../controllers/organizations.controller.js';

const router = Router();

// Any authenticated user — list orgs they belong to
router.get(
  '/me/organizations',
  requireAuth,
  orgController.listMyOrganizations,
);

// Org-scoped admin routes
router.get(
  '/admin/organization',
  requireAuth,
  requireOrg(),
  orgController.getCurrentOrganization,
);

router.get(
  '/admin/organization/members',
  requireAuth,
  requireOrg(),
  orgController.listOrganizationMembers,
);

export default router;