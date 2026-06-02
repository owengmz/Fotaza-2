// cargarmos en .env exxpres y bd 
import 'dotenv/config';
import express from 'express';
import { connectDatabase, Usuario } from './models/index.js';
import session from 'express-session';
import router from './routes/index.js';
// punto de entrada de la apps



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
// sesion de usuario
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));


// rutas

// pasa el usuario logueado a todas las vistas pug
app.use(async (req, res, next) => {
  if (req.session.usuarioId) {
    try {
      res.locals.usuario = await Usuario.findByPk(req.session.usuarioId, {
        attributes: ['id', 'nombre', 'nombreUsuario', 'avatar', 'rol'],
      });
    } catch (err) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }
  next();
});
// pug generamos html dinamico 
app.set('view engine', 'pug');
// transfiere el flash de sesion a locals y lo borra para que no se repita
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});
// con esto expres setea la carpeta donde estan vistas
app.set('views', './views');

// ruta de prueba para ver si el servidor esta funcionando
// ruta prueba
app.use('/', router);



// manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', { mensaje: err.message || 'Error interno del servidor' });
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