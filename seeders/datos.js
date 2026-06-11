import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase, Usuario } from '../models/index.js';

async function sembrar() {
  await connectDatabase();

  // usuarios de prueba por rol
  const passwordHash = await bcrypt.hash('test1234', 12);

  const [admin] = await Usuario.findOrCreate({
    where: { email: 'admin@fotaza.com' },
    defaults: {
      nombre: 'Admin',
      apellido: 'Fotaza',
      nombreUsuario: 'admin_fotaza',
      passwordHash,
      rol: 'admin',
      estado: 'activo',
    },
  });

  const [validador] = await Usuario.findOrCreate({
    where: { email: 'validador@fotaza.com' },
    defaults: {
      nombre: 'Validador',
      apellido: 'Fotaza',
      nombreUsuario: 'validador_fotaza',
      passwordHash,
      rol: 'validador',
      estado: 'activo',
    },
  });

  const [usuarioComun] = await Usuario.findOrCreate({
    where: { email: 'usuario@fotaza.com' },
    defaults: {
      nombre: 'Usuario',
      apellido: 'Prueba',
      nombreUsuario: 'usuario_prueba',
      passwordHash,
      rol: 'usuario',
      estado: 'activo',
    },
  });

  console.log('seeders ejecutados correctamente');
  console.log('usuarios de prueba:');
  console.log('  admin@fotaza.com / test1234 (rol: admin)');
  console.log('  validador@fotaza.com / test1234 (rol: validador)');
  console.log('  usuario@fotaza.com / test1234 (rol: usuario)');
  process.exit(0);
}

sembrar().catch((err) => {
  console.error('error en seeders:', err);
  process.exit(1);
});