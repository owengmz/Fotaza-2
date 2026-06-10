import { Router } from 'express';
import { mostrarConversaciones, mostrarChat, enviarMensaje } from '../controller/mensajeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, mostrarConversaciones);
router.get('/:usuarioId', requireAuth, mostrarChat);
router.post('/:usuarioId', requireAuth, enviarMensaje);

export default router;