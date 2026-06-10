import { Comentario, Publicacion } from '../models/index.js';
import { crearNotificacion } from '../helpers/notificaciones.js';

export async function agregarComentario(req, res, next) {
  try {
    const { contenido } = req.body;
    const publicacionId = parseInt(req.params.id);

    if (!contenido || !contenido.trim()) {
      req.session.flash = { tipo: 'error', mensajes: ['El comentario no puede estar vacio'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    await Comentario.create({
      contenido: contenido.trim(),
      publicacionId,
      usuarioId: req.session.usuarioId,
    });

    // notificamos al autor de la publicacion
    const publicacion = await Publicacion.findByPk(publicacionId, {
      attributes: ['usuarioId'],
    });

    await crearNotificacion({
      usuarioId: publicacion.usuarioId,
      generadorId: req.session.usuarioId,
      tipo: 'nuevo_comentario',
      publicacionId,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Comentario agregado'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}