// requireAuth. bloquea el acceso a rutas que requieren estar logueado
export function requireAuth(req, res, next) {
  if (!req.session.usuarioId) {
    req.session.flash = { tipo: 'error', mensajes: ['Debes iniciar sesion para acceder'] };
    return res.redirect('/auth/login');
  }
  next();
}

// soloAnonimo. bloquea el acceso a login y registro si ya estas logueado
export function soloAnonimo(req, res, next) {
  if (req.session.usuarioId) {
    return res.redirect('/');
  }
  next();
}