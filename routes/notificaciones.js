import { Router } from 'express';
import { mostrarNotificaciones, marcarLeida, marcarTodasLeidas } from '../controller/notificacionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, mostrarNotificaciones);
router.post('/:id/leida', requireAuth, marcarLeida);
router.post('/leer-todas', requireAuth, marcarTodasLeidas);

export default router;