import { Router } from 'express';
import { mostrarPerfil, mostrarMiPerfil } from '../controller/perfilController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, mostrarMiPerfil);
router.get('/:nombreUsuario', mostrarPerfil);

export default router;