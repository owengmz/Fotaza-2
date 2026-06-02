import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';
// controlador para manejar el registro y login de usuarios

export async function mostrarRegistro(req, res) {
  res.render('auth/registro');
}
// procesamos el registro validamos que el email y nombre de usuario sean unicos
export async function procesarRegistro(req, res, next) {
  try {
    const { nombre, apellido, nombreUsuario, email, password } = req.bodyValidado;

    // verificamos si el email o el nombre de usuario ya existen
    const existente = await Usuario.findOne({
      where: { email },
    });
    if (existente) {
      req.session.flash = { tipo: 'error', mensajes: ['El email ya esta registrado'] };
      return res.redirect('/auth/registro');
    }
    // verificamos el nombre de usuario
    const existenteUsuario = await Usuario.findOne({
      where: { nombreUsuario },
    });
    if (existenteUsuario) {
      req.session.flash = { tipo: 'error', mensajes: ['El nombre de usuario ya esta en uso'] };
      return res.redirect('/auth/registro');
    }

    // hasheamos la password antes de guardar
    const passwordHash = await bcrypt.hash(password, 12);

    await Usuario.create({
      nombre,
      apellido,
      nombreUsuario,
      email,
      passwordHash,
    });

    req.session.flash = { tipo: 'exito', mensajes: ['Cuenta creada. Ya podes iniciar sesion'] };
    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
}
// mostramos el formulario de login
export async function mostrarLogin(req, res) {
  res.render('auth/login');
}
// procesamos el login verificamos que el email exista que la password coincida y que la cuenta este activa
export async function procesarLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    // buscamos el usuario por email
    const usuario = await Usuario.findOne({
      where: { email },
    });

    // si no existe o la password no coincide, mismo mensaje
    // no le decimos al usuario cual de los dos fallo (seguridad)
    if (!usuario) {
      req.session.flash = { tipo: 'error', mensajes: ['Email o contrasena incorrectos'] };
      return res.redirect('/auth/login');
    }
    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      req.session.flash = { tipo: 'error', mensajes: ['Email o contrasena incorrectos'] };
      return res.redirect('/auth/login');
    }

    // verificamos que la cuenta este activa
    if (usuario.estado !== 'activo') {
      req.session.flash = { tipo: 'error', mensajes: ['Tu cuenta esta inactiva'] };
      return res.redirect('/auth/login');
    }

    // guardamos solo el id en sesion, el resto lo cargamos desde BD cuando se necesite
    req.session.usuarioId = usuario.id;
    // redirigimos al home o a donde quieras
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}