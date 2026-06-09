import { MeInteresa, Follower, Imagen, Publicacion } from '../models/index.js';

export async function toggleMeInteresa(req, res, next) {
  try {
    const imagenId = parseInt(req.params.imagenId);
    const publicacionId = parseInt(req.params.id);

    // verificamos que la imagen existe y pertenece a la publicacion
    const imagen = await Imagen.findOne({
      where: { id: imagenId, publicacionId },
    });

    if (!imagen) {
      return res.status(404).render('error', { mensaje: 'Imagen no encontrada' });
    }

    const existente = await MeInteresa.findOne({
      where: { usuarioId: req.session.usuarioId, imagenId },
    });

    if (existente) {
      await existente.destroy();
    } else {
      await MeInteresa.create({
        usuarioId: req.session.usuarioId,
        imagenId,
      });
    }

    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}

export async function toggleSeguir(req, res, next) {
  try {
    const usuarioSeguidoId = parseInt(req.params.usuarioId);
    const usuarioSeguidorId = req.session.usuarioId;

    if (usuarioSeguidorId === usuarioSeguidoId) {
      req.session.flash = { tipo: 'error', mensajes: ['No podes seguirte a vos mismo'] };
      return res.redirect('back');
    }

    const existente = await Follower.findOne({
      where: { usuarioSeguidorId, usuarioSeguidoId },
    });

    if (existente) {
      await existente.destroy();
    } else {
      await Follower.create({ usuarioSeguidorId, usuarioSeguidoId });
    }

    res.redirect('back');
  } catch (error) {
    next(error);
  }
}