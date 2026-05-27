import { Router } from 'express';

const router = Router();

// ruta de prueba - reemplazar en etapa 4 con la vista home real
router.get('/', (req, res) => {
  res.send('Fotaza 2 funcionando');
});

export default router;