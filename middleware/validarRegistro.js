import { z } from 'zod';
// Esquema de validacion para el registro de usuarios
// validamos que el nombre y apellido tengan entre 1 y 50 caracteres, el nombre de usuario entre 3 y 30 caracteres y solo letras numeros y guion bajo, el email sea valido y la password tenga al menos 4 caracteres
const esquemaRegistro = z.object({
  nombre: z.string().min(1).max(50),
  apellido: z.string().min(1).max(50),
  nombreUsuario: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Solo letras, numeros y guion bajo',
  }),
  email: z.string().email(),
  password: z.string().min(4),
});
// middleware para validar el registro de usuarios usando el esquema de validacion
export function validarRegistro(req, res, next) {
  const resultado = esquemaRegistro.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.issues.map((e) => e.message);
    req.session.flash = { tipo: 'error', mensajes: errores };
    return res.redirect('/auth/registro');
  }
  // si la validacion es exitosa guardamos los datos validados en req.bodyValidado para usarlo en el controlador
  req.bodyValidado = resultado.data;
  next();
}