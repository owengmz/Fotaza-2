import { Router } from 'express';
import { buscar } from '../controller/buscadorController.js';

const router = Router();

router.get('/', buscar);

export default router;