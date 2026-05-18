import sequelize from './config.js';
import { Usuario } from './Usuario.js';
// testeamos la conexion a base de datos
// falta agregar mas modelos para que se sincronice con la base de datos
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
export { Usuario };
// despues se pueden exportar otros modelos que estan en mi BD
// como verificamos si esta bien ?
//