import { Router } from 'express';
import { mostrarPanel, bajarPublicacion, desestimar } from '../controller/validadorController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireValidador } from '../middleware/roles.js';

const router = Router();

router.get('/', requireAuth, requireValidador, mostrarPanel);
router.post('/:id/bajar', requireAuth, requireValidador, bajarPublicacion);
router.post('/:id/desestimar', requireAuth, requireValidador, desestimar);

export default router;