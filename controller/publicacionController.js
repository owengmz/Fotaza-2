import { Publicacion, Imagen, Etiqueta, Usuario, Valoracion, Comentario, Coleccion } from '../models/index.js';
import { fn, col } from 'sequelize';

// controlador para vistas home y publicaciones, obtiene datos desde la base de datos y los pasa a la vista home.pug para renderizar
export function mostrarFormulario(req, res) {
  res.render('publicaciones/nueva');
}
// controlador para procesar el formulario de nueva publicacion, recibe datos del formulario y demas datos necesarios para crear la publicacion en la bd
export async function procesarPublicacion(req, res, next) {
  try {
    const { titulo, descripcion, licencia, textoMarcaAgua, etiquetas } = req.bodyValidado;

    // creamos la publicacion
    const publicacion = await Publicacion.create({
      titulo,
      descripcion: descripcion || null,
      usuarioId: req.session.usuarioId,
      comentariosAbiertos: true,
      estado: 'activa',
    });

    // creamos una fila en imagenes por cada archivo subido
    for (const file of req.files) {
      await Imagen.create({
        url: `/uploads/${file.filename}`,
        licencia,
        textoMarcaAgua: licencia === 'con_copyright' ? textoMarcaAgua : null,
        publicacionId: publicacion.id,
      });
    }

    // procesamos las etiquetas si las hay
    if (etiquetas && etiquetas.trim()) {
      const nombres = etiquetas.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

      for (const nombre of nombres) {
        // findOrCreate: si la etiqueta existe la reutiliza, si no la crea
        const [etiqueta] = await Etiqueta.findOrCreate({
          where: { nombre },
        });
        await publicacion.addEtiqueta(etiqueta);
      }
    }

    req.session.flash = { tipo: 'exito', mensajes: ['Publicacion creada correctamente'] };
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}
// controlador para mostrar el detalle de una publicacion, obtiene los datos de la publicacion desde la Bd y los pasa a la vista detalle.pug esta ultima renderiza
export async function mostrarDetalle(req, res, next) {
  try {
    const publicacion = await Publicacion.findOne({
      where: { id: req.params.id, estado: 'activa' },
      include: [
        {
          model: Imagen,
          as: 'imagenes',
        },
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar'],
        },
        {
          model: Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] },
        },
        {
          model: Comentario,
          as: 'comentarios',
          where: { deletedAt: null },
          required: false,
          include: [
            {
              model: Usuario,
              as: 'autor',
              attributes: ['id', 'nombreUsuario', 'avatar'],
            },
          ],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!publicacion) {
      return res.status(404).render('error', { mensaje: 'Publicacion no encontrada' });
    }

    const imagenesConValoracion = await Promise.all(
      publicacion.imagenes.map(async (imagen) => {
        const resultado = await Valoracion.findOne({
          where: { imagenId: imagen.id },
          attributes: [
            [fn('AVG', col('valor')), 'promedio'],
            [fn('COUNT', col('usuario_id')), 'cantidad'],
          ],
          raw: true,
        });
        return {
          ...imagen.toJSON(),
          promedio: resultado?.promedio ? parseFloat(resultado.promedio).toFixed(1) : null,
          cantidad: parseInt(resultado?.cantidad) || 0,
        };
      })
    );
    let colecciones = [];
    if (req.session.usuarioId) {
      const cols = await Coleccion.findAll({
        where: { usuarioId: req.session.usuarioId },
        attributes: ['id', 'nombre'],
      });
      colecciones = cols.map((c) => c.toJSON());
    }
    res.render('publicaciones/detalle', {
      publicacion: publicacion.toJSON(),
      imagenes: imagenesConValoracion,
      usuarioId: req.session.usuarioId || null,
      colecciones: colecciones,
    });
  } catch (error) {
    next(error);
  }
}