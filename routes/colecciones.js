import { Router } from 'express';
import { mostrarColecciones, crearColeccion, agregarPublicacion, mostrarColeccion } from '../controller/coleccionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, mostrarColecciones);
router.post('/', requireAuth, crearColeccion);
router.get('/:id', requireAuth, mostrarColeccion);
router.post('/:coleccionId/publicaciones/:publicacionId', requireAuth, agregarPublicacion);

export default router;