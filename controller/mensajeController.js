import { Mensaje, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

export async function mostrarConversaciones(req, res, next) {
  try {
    const usuarioId = req.session.usuarioId;

    // obtenemos todos los usuarios con los que hubo mensajes
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuarioId },
          { destinatarioId: usuarioId },
        ],
      },
      include: [
        { model: Usuario, as: 'remitente', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: Usuario, as: 'destinatario', attributes: ['id', 'nombreUsuario', 'avatar'] },
      ],
      order: [['fecha', 'DESC']],
    });

    // agrupamos por interlocutor para mostrar una conversacion por usuario
    const conversaciones = new Map();
    for (const mensaje of mensajes) {
      const otro = mensaje.remitenteId === usuarioId ? mensaje.destinatario : mensaje.remitente;
      if (!conversaciones.has(otro.id)) {
        conversaciones.set(otro.id, {
          usuario: otro.toJSON(),
          ultimoMensaje: mensaje.toJSON(),
        });
      }
    }

    res.render('mensajes/conversaciones', {
      conversaciones: Array.from(conversaciones.values()),
    });
  } catch (error) {
    next(error);
  }
}

export async function mostrarChat(req, res, next) {
  try {
    const usuarioId = req.session.usuarioId;
    const otroUsuarioId = parseInt(req.params.usuarioId);

    const otroUsuario = await Usuario.findByPk(otroUsuarioId, {
      attributes: ['id', 'nombreUsuario', 'avatar'],
    });

    if (!otroUsuario) {
      return res.status(404).render('error', { mensaje: 'Usuario no encontrado' });
    }

    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuarioId, destinatarioId: otroUsuarioId },
          { remitenteId: otroUsuarioId, destinatarioId: usuarioId },
        ],
      },
      order: [['fecha', 'ASC']],
    });

    // marcamos como leidos los mensajes recibidos
    await Mensaje.update(
      { leido: true },
      {
        where: {
          remitenteId: otroUsuarioId,
          destinatarioId: usuarioId,
          leido: false,
        },
      },
    );

    res.render('mensajes/chat', {
      otroUsuario: otroUsuario.toJSON(),
      mensajes: mensajes.map((m) => m.toJSON()),
      usuarioId,
    });
  } catch (error) {
    next(error);
  }
}

export async function enviarMensaje(req, res, next) {
  try {
    const usuarioId = req.session.usuarioId;
    const destinatarioId = parseInt(req.params.usuarioId);
    const { contenido } = req.body;

    if (!contenido || !contenido.trim()) {
      req.session.flash = { tipo: 'error', mensajes: ['El mensaje no puede estar vacio'] };
      return res.redirect(`/mensajes/${destinatarioId}`);
    }

    await Mensaje.create({
      remitenteId: usuarioId,
      destinatarioId,
      contenido: contenido.trim(),
    });

    res.redirect(`/mensajes/${destinatarioId}`);
  } catch (error) {
    next(error);
  }
}