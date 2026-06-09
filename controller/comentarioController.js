import { Comentario } from '../models/index.js';

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

    req.session.flash = { tipo: 'exito', mensajes: ['Comentario agregado'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}