const express = require('express');
const router = express.Router();
const { getProductos, getProductosAdmin, getProductoById, createProducto, updateProducto, toggleActivoProducto, deleteProducto } = require('../controllers/productos.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', getProductos);
router.get('/admin/todos', verifyToken, verifyAdmin, getProductosAdmin);
router.get('/:id', getProductoById);
router.post('/', verifyToken, verifyAdmin, createProducto);
router.put('/:id', verifyToken, verifyAdmin, updateProducto);
router.put('/:id/toggle-activo', verifyToken, verifyAdmin, toggleActivoProducto);
router.delete('/:id', verifyToken, verifyAdmin, deleteProducto);

module.exports = router;