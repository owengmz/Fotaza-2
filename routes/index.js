import { Router } from 'express';
import { mostrarHome } from '../controller/home.js';
import authRoutes from './auth.js';
import publicacionRoutes from './publicaciones.js';
import usuarioRoutes from './usuarios.js';
import perfilRoutes from './perfil.js';
import coleccionRoutes from './colecciones.js';
import notificacionRoutes from './notificaciones.js';
import validadorRoutes from './validador.js';
// Este archivo se encarga de definir las rutas principales de la aplicacion. La ruta raioz (/) muestra la página de inicio, y las rutas relacionadas con la autenticación se delegan al router definido en auth.js.
const router = Router();
// ruta raiz que muestra la pagina de inicio. esta ruta es accesible para todos los usuarios, independientemente de su estado de autenticacion.
router.get('/', mostrarHome);
router.use('/auth', authRoutes);
router.use('/publicaciones', publicacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/perfil', perfilRoutes);
router.use('/colecciones', coleccionRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/validador', validadorRoutes);
// exportamos el router para que pueda ser utilizado en el archivo principal de la aplicación (app.js). Esto permite mantener una estructura modular y organizada para las rutas de la aplicacion
export default router;
