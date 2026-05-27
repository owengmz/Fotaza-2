/* controlador para vistas home y publicaciones, obtiene datos desde la base de datos y los pasa a la vista home.pug para renderizar */
import { Publicacion, Imagen, Usuario } from '../models/index.js';

export async function mostrarHome(req, res, next) {
  try {
    const esAnonimo = !req.session.usuario;

    const where = esAnonimo ? { '$imagenes.licencia$': 'sin_copyright' } : {};

    const publicaciones = await Publicacion.findAll({
      where: { estado: 'activa' },
      include: [
        {
          model: Imagen,
          as: 'imagenes',
          where: esAnonimo ? { licencia: 'sin_copyright' } : undefined,
          required: esAnonimo,
        },
        {
          model: Usuario,
          as: 'autor',
          attributes: ['nombreUsuario'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    res.render('home', { publicaciones });
  } catch (err) {
    next(err);
  }
}