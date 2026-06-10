import { Valoracion, Imagen, Publicacion } from '../models/index.js';
import { crearNotificacion } from '../helpers/notificaciones.js';

export async function valorar(req, res, next) {
  try {
    const imagenId = parseInt(req.params.imagenId);
    const publicacionId = parseInt(req.params.id);
    const valor = parseInt(req.body.valor);

    if (!valor || valor < 1 || valor > 5) {
      req.session.flash = { tipo: 'error', mensajes: ['La valoracion debe ser entre 1 y 5'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    const imagen = await Imagen.findOne({
      where: { id: imagenId, publicacionId },
    });

    if (!imagen) {
      return res.status(404).render('error', { mensaje: 'Imagen no encontrada' });
    }

    const publicacion = await Publicacion.findByPk(publicacionId, {
      attributes: ['usuarioId'],
    });

    if (publicacion.usuarioId === req.session.usuarioId) {
      req.session.flash = { tipo: 'error', mensajes: ['No podes valorar tu propia publicacion'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    await Valoracion.upsert({
      usuarioId: req.session.usuarioId,
      imagenId,
      valor,
    });

    // notificamos al autor de la publicacion
    await crearNotificacion({
      usuarioId: publicacion.usuarioId,
      generadorId: req.session.usuarioId,
      tipo: 'nueva_valoracion',
      publicacionId,
      imagenId,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Valoracion guardada'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}