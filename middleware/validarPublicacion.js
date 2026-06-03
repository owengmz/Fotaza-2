// middleware para validar los datos del formulario de nueva publicacion
//importamos zod para validar datos del formulario
import { z } from 'zod';
// definimos el esquema de validacion para los datos del formulario
const esquemaPublicacion = z.object({
  titulo: z.string().min(1).max(150),
  descripcion: z.string().optional(),
  etiquetas: z.string().optional(),
  licencia: z.enum(['con_copyright', 'sin_copyright']),
  textoMarcaAgua: z.string().optional(),
});
// exportamos la funcion middleware que valida los datos del formulario segun el esquema definido
export function validarPublicacion(req, res, next) {
  const resultado = esquemaPublicacion.safeParse(req.body);

  if (!resultado.success) {
    const errores = resultado.error.issues.map((e) => e.message);
    req.session.flash = { tipo: 'error', mensajes: errores };
    return res.redirect('/publicaciones/nueva');
  }

  const datos = resultado.data;

  // si la licencia es con_copyright la marca de agua es obligatoria
  if (datos.licencia === 'con_copyright' && !datos.textoMarcaAgua?.trim()) {
    req.session.flash = { tipo: 'error', mensajes: ['La marca de agua es obligatoria para imagenes con copyright'] };
    return res.redirect('/publicaciones/nueva');
  }

  // verificamos que haya al menos una imagen
  if (!req.files || req.files.length === 0) {
    req.session.flash = { tipo: 'error', mensajes: ['Debes subir al menos una imagen'] };
    return res.redirect('/publicaciones/nueva');
  }

  req.bodyValidado = datos;
  next();
}