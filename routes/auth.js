import { Router } from 'express';
import { mostrarRegistro, procesarRegistro, mostrarLogin, procesarLogin } from '../controller/authController.js';
import { validarRegistro } from '../middleware/validarRegistro.js';
import { soloAnonimo } from '../middleware/auth.js';

const router = Router();
// Rutas de autenticacion: registro login y logout. esto hace que solo los usuarios no autenticados puedan acceder a estas rutas, y los usuarios autenticados sean redirigidos a la página principal.
router.get('/registro', soloAnonimo, mostrarRegistro);
router.post('/registro', soloAnonimo, validarRegistro, procesarRegistro);
router.get('/login', soloAnonimo, mostrarLogin);
router.post('/login', soloAnonimo, procesarLogin);
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;