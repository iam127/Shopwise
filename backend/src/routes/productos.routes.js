const express = require('express');
const router = express.Router();
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../controllers/productos.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', verifyToken, verifyAdmin, createProducto);
router.put('/:id', verifyToken, verifyAdmin, updateProducto);
router.delete('/:id', verifyToken, verifyAdmin, deleteProducto);

module.exports = router;