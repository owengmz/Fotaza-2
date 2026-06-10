import { MeInteresa, Follower, Imagen, Publicacion } from '../models/index.js';
import { crearNotificacion } from '../helpers/notificaciones.js';

export async function toggleMeInteresa(req, res, next) {
  try {
    const imagenId = parseInt(req.params.imagenId);
    const publicacionId = parseInt(req.params.id);

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

      // notificamos al autor solo cuando se agrega, no cuando se quita
      const publicacion = await Publicacion.findByPk(publicacionId, {
        attributes: ['usuarioId'],
      });

      await crearNotificacion({
        usuarioId: publicacion.usuarioId,
        generadorId: req.session.usuarioId,
        tipo: 'me_interesa',
        publicacionId,
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
      return res.redirect(`/perfil`);
    }

    const existente = await Follower.findOne({
      where: { usuarioSeguidorId, usuarioSeguidoId },
    });

    if (existente) {
      await existente.destroy();
    } else {
      await Follower.create({ usuarioSeguidorId, usuarioSeguidoId });

      // notificamos al usuario seguido solo cuando se empieza a seguir
      await crearNotificacion({
        usuarioId: usuarioSeguidoId,
        generadorId: usuarioSeguidorId,
        tipo: 'nuevo_seguidor',
      });
    }

    res.redirect('back');
  } catch (error) {
    next(error);
  }
}