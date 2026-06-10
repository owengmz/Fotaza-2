export function requireValidador(req, res, next) {
  if (!res.locals.usuario || (res.locals.usuario.rol !== 'validador' && res.locals.usuario.rol !== 'admin')) {
    return res.status(403).render('error', { mensaje: 'No tenes permiso para acceder a esta seccion' });
  }
  next();
}