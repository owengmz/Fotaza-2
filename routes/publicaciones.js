// rutas para publicaciones
// importamos router de express para definir las rutas relacionadas con la publicacion, los controladores para manejar la logica de cada ruta, el middleware de autenticacion para proteger las rutas que requieren usuario loguedo y el middleware de validacion para validar los datos del formulario de nueva publicacion
import { Router } from 'express';
import { mostrarFormulario, procesarPublicacion, mostrarDetalle } from '../controller/publicacionController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validarPublicacion } from '../middleware/validarPublicacion.js';
import { agregarComentario } from '../controller/comentarioController.js';
import { valorar } from '../controller/valoracionController.js';
import { toggleMeInteresa } from '../controller/socialController.js';
// creamos el router para definir las rutas relacionadas con las publicaciones
const router = Router();
// definimos las rutas para crear una nueva publicacion y mostrar el detalle de una publicacion 
// router.get hace que la ruta sea accesible solo para usuarios logueados
// router.post hace que la ruta sea accesible solo para usuarios logueados como router.get pero ademas de procesa el formulario de nueva publicacion y otras validaciones necesarias para crear la publicacion en la base de datos
router.get('/nueva', requireAuth, mostrarFormulario);
router.post('/nueva', requireAuth, upload.array('imagenes', 10), validarPublicacion, procesarPublicacion);
router.post('/:id/comentarios', requireAuth, agregarComentario);
router.get('/:id', mostrarDetalle);
router.post('/:id/imagenes/:imagenId/valorar', requireAuth, valorar);
router.post('/:id/imagenes/:imagenId/me-interesa', requireAuth, toggleMeInteresa);

export default router;