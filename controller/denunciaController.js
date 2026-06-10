import { DenunciaImagen, DenunciaComentario, Imagen, Comentario, Publicacion } from '../models/index.js';

export async function denunciarImagen(req, res, next) {
  try {
    const imagenId = parseInt(req.params.imagenId);
    const publicacionId = parseInt(req.params.id);
    const { motivo, descripcion } = req.body;

    if (!motivo || !descripcion || !descripcion.trim()) {
      req.session.flash = { tipo: 'error', mensajes: ['Motivo y descripcion son obligatorios'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    const imagen = await Imagen.findOne({
      where: { id: imagenId, publicacionId },
    });

    if (!imagen) {
      return res.status(404).render('error', { mensaje: 'Imagen no encontrada' });
    }

    // upsert: un usuario no puede denunciar la misma imagen dos veces
    await DenunciaImagen.upsert({
      usuarioId: req.session.usuarioId,
      imagenId,
      motivo,
      descripcion: descripcion.trim(),
    });

    // contamos denuncias distintas para esta imagen
    const cantDenuncias = await DenunciaImagen.count({
      where: { imagenId },
    });

    // si hay mas de 3 denuncias la publicacion pasa a pendiente_revision
    if (cantDenuncias >= 3) {
      await Publicacion.update(
        { estado: 'pendiente_revision' },
        { where: { id: publicacionId } },
      );
    }

    req.session.flash = { tipo: 'exito', mensajes: ['Denuncia enviada'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}

export async function denunciarComentario(req, res, next) {
  try {
    const comentarioId = parseInt(req.params.comentarioId);
    const publicacionId = parseInt(req.params.id);
    const { motivo, descripcion } = req.body;

    if (!motivo || !descripcion || !descripcion.trim()) {
      req.session.flash = { tipo: 'error', mensajes: ['Motivo y descripcion son obligatorios'] };
      return res.redirect(`/publicaciones/${publicacionId}`);
    }

    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).render('error', { mensaje: 'Comentario no encontrado' });
    }

    await DenunciaComentario.upsert({
      usuarioId: req.session.usuarioId,
      comentarioId,
      motivo,
      descripcion: descripcion.trim(),
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Denuncia enviada'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}

export async function borrarComentario(req, res, next) {
  try {
    const comentarioId = parseInt(req.params.comentarioId);
    const publicacionId = parseInt(req.params.id);

    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).render('error', { mensaje: 'Comentario no encontrado' });
    }

    // solo el autor de la publicacion puede borrar comentarios
    const publicacion = await Publicacion.findByPk(publicacionId, {
      attributes: ['usuarioId'],
    });

    if (publicacion.usuarioId !== req.session.usuarioId) {
      return res.status(403).render('error', { mensaje: 'No tenes permiso para hacer esto' });
    }

    await comentario.destroy();

    req.session.flash = { tipo: 'exito', mensajes: ['Comentario eliminado'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}