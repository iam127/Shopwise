const express = require('express');
const router = express.Router();
const {
  crearTestimonio,
  getTestimoniosAprobados,
  getTodosTestimonios,
  toggleAprobarTestimonio,
  eliminarTestimonio,
  miTestimonio,
} = require('../controllers/testimonios.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', getTestimoniosAprobados);
router.post('/', verifyToken, crearTestimonio);
router.get('/mi-testimonio', verifyToken, miTestimonio);
router.get('/admin/todos', verifyToken, verifyAdmin, getTodosTestimonios);
router.put('/:id/toggle-aprobar', verifyToken, verifyAdmin, toggleAprobarTestimonio);
router.delete('/:id', verifyToken, verifyAdmin, eliminarTestimonio);

module.exports = router;