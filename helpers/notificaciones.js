import { Notificacion } from '../models/index.js';

export async function crearNotificacion({ usuarioId, generadorId, tipo, publicacionId = null, imagenId = null }) {
  // no notificamos al propio usuario de sus acciones
  if (usuarioId === generadorId) return;

  await Notificacion.create({
    usuarioId,
    generadorId,
    tipo,
    publicacionId,
    imagenId,
  });
}