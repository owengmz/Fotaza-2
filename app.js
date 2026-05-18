// cargarmos en .env exxpres y bd 
import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './models/index.js';

// punto de entrada de la app

// constantes
const PORT = process.env.PORT || 3000;
const app = express();
// con express podemos obtener los archivos estaticos de la carpeta public y parcear el boddy 

// middlewares
app.use(express.static('public'));
// hace que el servidor entienda los datos en formato json
app.use(express.json());
// permite que el servidor entienda los datos del formulario
app.use(express.urlencoded({ extended: true }));
// pug generamos html dinamico 
app.set('view engine', 'pug');
// con esto expres setea la carpeta donde estan vistas
app.set('views', './views');

// ruta de prueba para ver si el servidor esta funcionando
app.get('/', (req, res) => {
  res.send('Fotaza 2 funcionando');
});

// conexcion a la BD e iniciar el servidor
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar la aplicacion:', err);
  });