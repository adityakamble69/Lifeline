import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import * as requestsController from '../controllers/requests.controller.js';

const router = Router();

// Public — anyone can see verified requests
router.get('/requests', requestsController.listRequests);

// Auth required — create a new request
router.post('/requests', requireAuth, requestsController.createRequest);

export default router;