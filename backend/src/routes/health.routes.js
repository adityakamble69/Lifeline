import { Router } from 'express';
import supabase from '../config/supabaseClient.js';

const router = Router();

// GET /api/v1/health
// Basic liveness check. Also reports whether the Supabase client is
// configured, without making the frontend depend on the database being up.
router.get('/health', async (req, res) => {
  const status = {
    status: 'ok',
    service: 'lifeline-backend',
    timestamp: new Date().toISOString(),
    database: supabase ? 'configured' : 'not_configured',
  };

  res.status(200).json(status);
});

export default router;
