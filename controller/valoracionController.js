import { Valoracion, Imagen, Publicacion } from '../models/index.js';

export async function valorar(req, res, next) {
  try {
    const imagenId = parseInt(req.params.imagenId);
    const publicacionId = parseInt(req.params.id);
    const valor = parseInt(req.body.valor);

    if (!valor || valor < 1 || valor > 5) {
      req.session.flash = { tipo: 'error', mensajes: ['La valoracion debe ser entre 1 y 5'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    // verificamos que la imagen pertenece a la publicacion
    const imagen = await Imagen.findOne({
      where: { id: imagenId, publicacionId },
    });

    if (!imagen) {
      return res.status(404).render('error', { mensaje: 'Imagen no encontrada' });
    }

    // el autor no puede valorar su propia imagen
    const publicacion = await Publicacion.findByPk(publicacionId, {
      attributes: ['usuarioId'],
    });

    if (publicacion.usuarioId === req.session.usuarioId) {
      req.session.flash = { tipo: 'error', mensajes: ['No podes valorar tu propia publicacion'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    // upsert: si ya valoro esta imagen actualiza el valor, si no crea la fila
    await Valoracion.upsert({
      usuarioId: req.session.usuarioId,
      imagenId,
      valor,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Valoracion guardada'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}