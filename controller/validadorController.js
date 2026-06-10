import { Publicacion, Imagen, DenunciaImagen, Usuario } from '../models/index.js';

export async function mostrarPanel(req, res, next) {
  try {
    // publicaciones en pendiente_revision con sus denuncias
    const publicaciones = await Publicacion.findAll({
      where: { estado: 'pendiente_revision' },
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario'],
        },
        {
          model: Imagen,
          as: 'imagenes',
          include: [
            {
              model: Usuario,
              as: 'usuariosDenunciantes',
              attributes: ['id', 'nombreUsuario'],
              through: {
                attributes: ['motivo', 'descripcion'],
              },
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.render('validador/panel', {
      publicaciones: publicaciones.map((p) => p.toJSON()),
    });
  } catch (error) {
    next(error);
  }
}

export async function bajarPublicacion(req, res, next) {
  try {
    const publicacionId = parseInt(req.params.id);

    await Publicacion.update(
      { estado: 'bajada' },
      { where: { id: publicacionId } },
    );

    // verificamos si el autor tiene 3 o mas publicaciones bajadas
    const publicacion = await Publicacion.findByPk(publicacionId, {
      attributes: ['usuarioId'],
    });

    const cantBajadas = await Publicacion.count({
      where: { usuarioId: publicacion.usuarioId, estado: 'bajada' },
    });

    if (cantBajadas >= 3) {
      await Usuario.update(
        { estado: 'inactivo' },
        { where: { id: publicacion.usuarioId } },
      );
    }

    req.session.flash = { tipo: 'exito', mensajes: ['Publicacion bajada'] };
    res.redirect('/validador');
  } catch (error) {
    next(error);
  }
}

export async function desestimar(req, res, next) {
  try {
    const publicacionId = parseInt(req.params.id);

    // volvemos la publicacion a activa y borramos las denuncias de sus imagenes
    await Publicacion.update(
      { estado: 'activa' },
      { where: { id: publicacionId } },
    );

    const imagenes = await Imagen.findAll({
      where: { publicacionId },
      attributes: ['id'],
    });

    for (const imagen of imagenes) {
      await DenunciaImagen.destroy({
        where: { imagenId: imagen.id },
      });
    }

    req.session.flash = { tipo: 'exito', mensajes: ['Denuncias desestimadas'] };
    res.redirect('/validador');
  } catch (error) {
    next(error);
  }
}