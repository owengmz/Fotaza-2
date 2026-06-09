import { Usuario, Publicacion, Imagen, Follower, Coleccion } from '../models/index.js';

export async function mostrarPerfil(req, res, next) {
  try {
    const nombreUsuario = req.params.nombreUsuario;

    const usuario = await Usuario.findOne({
      where: { nombreUsuario },
      attributes: ['id', 'nombre', 'apellido', 'nombreUsuario', 'avatar', 'bio'],
    });

    if (!usuario) {
      return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
    }

    // publicaciones del usuario
    const publicaciones = await Publicacion.findAll({
      where: { usuarioId: usuario.id, estado: 'activa' },
      include: [{ model: Imagen, as: 'imagenes' }],
      order: [['createdAt', 'DESC']],
    });

    // cantidad de seguidores y seguidos
    const cantSeguidores = await Follower.count({
      where: { usuarioSeguidoId: usuario.id },
    });
    const cantSeguidos = await Follower.count({
      where: { usuarioSeguidorId: usuario.id },
    });

    // si el usuario logueado sigue a este perfil
    let yaSigue = false;
    if (req.session.usuarioId) {
      const relacion = await Follower.findOne({
        where: {
          usuarioSeguidorId: req.session.usuarioId,
          usuarioSeguidoId: usuario.id,
        },
      });
      yaSigue = !!relacion;
    }

    res.render('perfil/perfil', {
      perfil: usuario.toJSON(),
      publicaciones: publicaciones.map((p) => p.toJSON()),
      cantSeguidores,
      cantSeguidos,
      yaSigue,
      esPropietario: req.session.usuarioId === usuario.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function mostrarMiPerfil(req, res, next) {
  req.params.nombreUsuario = res.locals.usuario.nombreUsuario;
  return mostrarPerfil(req, res, next);
}