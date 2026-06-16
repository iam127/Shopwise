const express = require('express');
const router = express.Router();
const { getCarrito, addItem, removeItem, clearCarrito } = require('../controllers/carrito.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getCarrito);
router.post('/add', verifyToken, addItem);
router.delete('/item/:id', verifyToken, removeItem);
router.delete('/clear', verifyToken, clearCarrito);

module.exports = router;