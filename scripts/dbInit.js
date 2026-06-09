import { connectDatabase } from '../models/index.js';

connectDatabase()
  .then(() => {
    console.log('base de datos inicializada correctamente');
    process.exit(0);
  })
  .catch((err) => {
    console.error('error al inicializar la base de datos:', err);
    process.exit(1);
  });