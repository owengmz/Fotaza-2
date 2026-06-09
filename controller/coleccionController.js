import { Coleccion, ColeccionPublicacion, Publicacion, Imagen } from '../models/index.js';

export async function mostrarColecciones(req, res, next) {
  try {
    const colecciones = await Coleccion.findAll({
      where: { usuarioId: req.session.usuarioId },
      order: [['createdAt', 'DESC']],
    });

    res.render('colecciones/index', {
      colecciones: colecciones.map((c) => c.toJSON()),
    });
  } catch (error) {
    next(error);
  }
}

export async function crearColeccion(req, res, next) {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      req.session.flash = { tipo: 'error', mensajes: ['El nombre es obligatorio'] };
      return res.redirect('/colecciones');
    }

    await Coleccion.create({
      nombre: nombre.trim(),
      usuarioId: req.session.usuarioId,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Coleccion creada'] };
    res.redirect('/colecciones');
  } catch (error) {
    next(error);
  }
}

export async function agregarPublicacion(req, res, next) {
  try {
    const coleccionId = parseInt(req.params.coleccionId);
    const publicacionId = parseInt(req.params.publicacionId);

    // verificamos que la coleccion pertenece al usuario logueado
    const coleccion = await Coleccion.findOne({
      where: { id: coleccionId, usuarioId: req.session.usuarioId },
    });

    if (!coleccion) {
      return res.status(404).render('error', { mensaje: 'Coleccion no encontrada' });
    }

    // upsert evita duplicar la misma publicacion en la misma coleccion
    await ColeccionPublicacion.upsert({
      coleccionId,
      publicacionId,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Publicacion agregada a la coleccion'] };
    res.redirect(`/publicaciones/${publicacionId}`);
  } catch (error) {
    next(error);
  }
}

export async function mostrarColeccion(req, res, next) {
  try {
    const coleccion = await Coleccion.findOne({
      where: { id: req.params.id, usuarioId: req.session.usuarioId },
      include: [
        {
          model: Publicacion,
          as: 'publicaciones',
          through: { attributes: [] },
          include: [{ model: Imagen, as: 'imagenes' }],
        },
      ],
    });

    if (!coleccion) {
      return res.status(404).render('error', { mensaje: 'Coleccion no encontrada' });
    }

    res.render('colecciones/detalle', {
      coleccion: coleccion.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}