import { Publicacion, Imagen, Usuario, Etiqueta } from '../models/index.js';
import { Op } from 'sequelize';

export async function buscar(req, res, next) {
  try {
    const { titulo, autor, etiqueta, licencia, valoracionMin } = req.query;
    const esAnonimo = !req.session.usuarioId;

    // construimos el where con Op.and para combinar filtros
    const where = { estado: 'activa' };
    const condiciones = [];

    if (titulo && titulo.trim()) {
      condiciones.push({ titulo: { [Op.iLike]: `%${titulo.trim()}%` } });
    }

    if (condiciones.length > 0) {
      where[Op.and] = condiciones;
    }

    // filtros para los includes
    const whereImagen = {};
    if (licencia) {
      whereImagen.licencia = licencia;
    }
    if (esAnonimo) {
      whereImagen.licencia = 'sin_copyright';
    }

    const whereAutor = {};
    if (autor && autor.trim()) {
      whereAutor.nombreUsuario = { [Op.iLike]: `%${autor.trim()}%` };
    }

    const includeEtiqueta = [];
    if (etiqueta && etiqueta.trim()) {
      includeEtiqueta.push({
        model: Etiqueta,
        as: 'etiquetas',
        where: { nombre: { [Op.iLike]: `%${etiqueta.trim()}%` } },
        through: { attributes: [] },
        required: true,
      });
    } else {
      includeEtiqueta.push({
        model: Etiqueta,
        as: 'etiquetas',
        through: { attributes: [] },
        required: false,
      });
    }

    const publicaciones = await Publicacion.findAll({
      where,
      include: [
        {
          model: Imagen,
          as: 'imagenes',
          where: Object.keys(whereImagen).length ? whereImagen : undefined,
          required: esAnonimo || !!licencia,
        },
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario'],
          where: Object.keys(whereAutor).length ? whereAutor : undefined,
          required: !!autor,
        },
        ...includeEtiqueta,
      ],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });

    res.render('buscador/resultados', {
      publicaciones: publicaciones.map((p) => p.toJSON()),
      query: req.query,
    });
  } catch (error) {
    next(error);
  }
}