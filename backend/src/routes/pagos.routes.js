const express = require('express');
const router = express.Router();
const { procesarPago, getPagoByPedido } = require('../controllers/pagos.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, procesarPago);
router.get('/:pedido_id', verifyToken, getPagoByPedido);

module.exports = router;