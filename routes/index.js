import { Router } from 'express';
import { mostrarHome } from '../controller/home.js';


const router = Router();

router.get('/', mostrarHome);

export default router;