const express = require('express');
const router = express.Router();
const { createPedido, getPedidos, getPedidoById, getAllPedidos } = require('../controllers/pedidos.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createPedido);
router.get('/', verifyToken, getPedidos);
router.get('/all', verifyToken, verifyAdmin, getAllPedidos);
router.get('/:id', verifyToken, getPedidoById);

module.exports = router;