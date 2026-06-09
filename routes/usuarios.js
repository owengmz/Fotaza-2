import { Router } from 'express';
import { toggleSeguir } from '../controller/socialController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/:usuarioId/seguir', requireAuth, toggleSeguir);

export default router;