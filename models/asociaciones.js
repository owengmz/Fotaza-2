import { Usuario } from './Usuario.js';
import { Publicacion } from './Publicacion.js';
import { Imagen } from './Imagen.js';
import { Etiqueta } from './Etiqueta.js';
import { PublicacionEtiqueta } from './PublicacionEtiqueta.js';
import { Comentario } from './Comentario.js';
import { Valoracion } from './Valoracion.js';
import { MeInteresa } from './MeInteresa.js';
import { Follower } from './Follower.js';
import { Notificacion } from './Notificacion.js';
import { Coleccion } from './Coleccion.js';
import { ColeccionPublicacion } from './ColeccionPublicacion.js';
import { DenunciaImagen } from './DenunciaImagen.js';
import { DenunciaComentario } from './DenunciaComentario.js';
import { Mensaje } from './Mensaje.js';

export function definirAsociaciones() {
  // Publicaciones
  Usuario.hasMany(Publicacion, { foreignKey: 'usuario_id', as: 'publicaciones' });
  Publicacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

  // Imagenes
  Publicacion.hasMany(Imagen, { foreignKey: 'publicacion_id', as: 'imagenes' });
  Imagen.belongsTo(Publicacion, { foreignKey: 'publicacion_id', as: 'publicacion' });

  // Etiquetas M:N
  Publicacion.belongsToMany(Etiqueta, {
    through: PublicacionEtiqueta,
    foreignKey: 'publicacion_id',
    otherKey: 'etiqueta_id',
    as: 'etiquetas',
  });
  Etiqueta.belongsToMany(Publicacion, {
    through: PublicacionEtiqueta,
    foreignKey: 'etiqueta_id',
    otherKey: 'publicacion_id',
    as: 'publicaciones',
  });

  // Comentarios
  Publicacion.hasMany(Comentario, { foreignKey: 'publicacion_id', as: 'comentarios' });
  Comentario.belongsTo(Publicacion, { foreignKey: 'publicacion_id', as: 'publicacion' });
  Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
  Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

  // Valoraciones M:N
  Usuario.belongsToMany(Imagen, {
    through: Valoracion,
    foreignKey: 'usuario_id',
    otherKey: 'imagen_id',
    as: 'imagenesValoradas',
  });
  Imagen.belongsToMany(Usuario, {
    through: Valoracion,
    foreignKey: 'imagen_id',
    otherKey: 'usuario_id',
    as: 'usuariosQueValoraron',
  });

  // Me Interesa M:N
  Usuario.belongsToMany(Imagen, {
    through: MeInteresa,
    foreignKey: 'usuario_id',
    otherKey: 'imagen_id',
    as: 'imagenesInteresadas',
  });
  Imagen.belongsToMany(Usuario, {
    through: MeInteresa,
    foreignKey: 'imagen_id',
    otherKey: 'usuario_id',
    as: 'usuariosInteresados',
  });

  // Followers (auto-relacion M:N)
  Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'seguidos',
    foreignKey: 'usuario_seguidor_id',
    otherKey: 'usuario_seguido_id',
  });
  Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'seguidores',
    foreignKey: 'usuario_seguido_id',
    otherKey: 'usuario_seguidor_id',
  });

  // Notificaciones
  Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones' });
  Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'destinatario' });
  Usuario.hasMany(Notificacion, { foreignKey: 'generador_id', as: 'notificacionesGeneradas' });
  Notificacion.belongsTo(Usuario, { foreignKey: 'generador_id', as: 'generador' });
  Publicacion.hasMany(Notificacion, { foreignKey: 'publicacion_id', as: 'notificaciones' });
  Notificacion.belongsTo(Publicacion, { foreignKey: 'publicacion_id', as: 'publicacion' });
  Imagen.hasMany(Notificacion, { foreignKey: 'imagen_id', as: 'notificaciones' });
  Notificacion.belongsTo(Imagen, { foreignKey: 'imagen_id', as: 'imagen' });
}
// Colecciones: un usuario tiene muchas colecciones
Usuario.hasMany(Coleccion, { foreignKey: 'usuario_id', as: 'colecciones' });
Coleccion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'propietario' });

// Coleccion-Publicacion M:N
Coleccion.belongsToMany(Publicacion, {
  through: ColeccionPublicacion,
  foreignKey: 'coleccion_id',
  otherKey: 'publicacion_id',
  as: 'publicaciones',
});
Publicacion.belongsToMany(Coleccion, {
  through: ColeccionPublicacion,
  foreignKey: 'publicacion_id',
  otherKey: 'coleccion_id',
  as: 'colecciones',
});
// Denuncias de imagen M:N
Usuario.belongsToMany(Imagen, {
  through: DenunciaImagen,
  foreignKey: 'usuario_id',
  otherKey: 'imagen_id',
  as: 'imagenesDenunciadas',
});
Imagen.belongsToMany(Usuario, {
  through: DenunciaImagen,
  foreignKey: 'imagen_id',
  otherKey: 'usuario_id',
  as: 'usuariosDenunciantes',
});

// Denuncias de comentario M:N
Usuario.belongsToMany(Comentario, {
  through: DenunciaComentario,
  foreignKey: 'usuario_id',
  otherKey: 'comentario_id',
  as: 'comentariosDenunciados',
});
Comentario.belongsToMany(Usuario, {
  through: DenunciaComentario,
  foreignKey: 'comentario_id',
  otherKey: 'usuario_id',
  as: 'usuariosDenunciantes',
});

// Mensajes
Usuario.hasMany(Mensaje, { foreignKey: 'remitente_id', as: 'mensajesEnviados' });
Mensaje.belongsTo(Usuario, { foreignKey: 'remitente_id', as: 'remitente' });
Usuario.hasMany(Mensaje, { foreignKey: 'destinatario_id', as: 'mensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'destinatario_id', as: 'destinatario' });
Imagen.hasMany(Mensaje, { foreignKey: 'imagen_id', as: 'mensajes', onDelete: 'SET NULL' });
Mensaje.belongsTo(Imagen, { foreignKey: 'imagen_id', as: 'imagen', onDelete: 'SET NULL' });