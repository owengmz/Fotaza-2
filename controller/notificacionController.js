import { Notificacion, Usuario, Publicacion, Imagen } from '../models/index.js';

export async function mostrarNotificaciones(req, res, next) {
  try {
    const notificaciones = await Notificacion.findAll({
      where: { usuarioId: req.session.usuarioId },
      include: [
        {
          model: Usuario,
          as: 'generador',
          attributes: ['id', 'nombreUsuario', 'avatar'],
        },
        {
          model: Publicacion,
          as: 'publicacion',
          attributes: ['id', 'titulo'],
          required: false,
        },
      ],
      order: [['fecha', 'DESC']],
      limit: 50,
    });

    res.render('notificaciones/index', {
      notificaciones: notificaciones.map((n) => n.toJSON()),
    });
  } catch (error) {
    next(error);
  }
}

export async function marcarLeida(req, res, next) {
  try {
    const notificacionId = parseInt(req.params.id);

    await Notificacion.update(
      { leida: true },
      { where: { id: notificacionId, usuarioId: req.session.usuarioId } },
    );

    res.redirect('/notificaciones');
  } catch (error) {
    next(error);
  }
}

export async function marcarTodasLeidas(req, res, next) {
  try {
    await Notificacion.update(
      { leida: true },
      { where: { usuarioId: req.session.usuarioId } },
    );

    res.redirect('/notificaciones');
  } catch (error) {
    next(error);
  }
}