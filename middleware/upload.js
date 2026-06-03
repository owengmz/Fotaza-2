// middleware para subir imagenes importamos multer y path para manejar rutas de archivos
import multer from 'multer';
import path from 'path';
// configuramos multer para guardar las imagenes en la carpeta public/uploads y generar nombre para cada imagen que subamos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, nombre);
  },
});
// configuramos multer para aceptar solo imagenes con ciertos formatos
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imagenes jpg, png, webp o gif'), false);
  }
};

export const upload = multer({ storage, fileFilter });