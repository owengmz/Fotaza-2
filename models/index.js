import sequelize from './config.js';
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
import { definirAsociaciones } from './asociaciones.js';
import { Coleccion } from './Coleccion.js';
import { ColeccionPublicacion } from './ColeccionPublicacion.js';
import { DenunciaImagen } from './DenunciaImagen.js';
import { DenunciaComentario } from './DenunciaComentario.js';
import { Mensaje } from './Mensaje.js';
// testeamos la conexion a base de datos
// falta agregar mas modelos para que se sincronice con la base de datos

// Llamamos a todas las asociaciones
definirAsociaciones();

export async function connectDatabase() {
  // usamos async/await para manejar la conexion a la base de datos
  try {
    // usamos autenticate para probar la conexion a BD
    await sequelize.authenticate();
    // que imprima un mensaje de exito si la conexion es exitosa
    console.log("conexion a base de datos exitosa");

    // sincronizamos el modelo de tablas de Usuario conn esto creamos la tabla o la actualizamos si ya existe
    await sequelize.sync({ alter: true });
    // con alter true si la tabla ya existe pero cambie algo en el modelo (agregue una columna, por ejemplo) ajusta la tabla para que coincida con esto eviitamos escribir sql manualmente.
    console.log("tablas sincronizadas");
  } catch (error) {
    console.error("error al conectar a la base de datos:", error);
    throw error; // relanzamos el error para que pueda ser manejado por quien llame a esta funcion
  }

}
// por ultimo exportamos el modelo usuario para que pueda ser usado en otras partes de la aplicacion como en los controladores o rutas
export { Usuario, Publicacion, Imagen, Etiqueta, PublicacionEtiqueta, Comentario, Valoracion, MeInteresa, Follower, Notificacion, Coleccion, ColeccionPublicacion, DenunciaImagen, DenunciaComentario, Mensaje };
// despues se pueden exportar otros modelos que estan en mi BD
// como verificamos si esta bien ?
//