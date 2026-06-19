const express = require('express');
const router = express.Router();
const { enviarMensaje, listarMensajes, marcarLeido } = require('../controllers/contacto.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', enviarMensaje);
router.get('/', verifyToken, verifyAdmin, listarMensajes);
router.put('/:id/leido', verifyToken, verifyAdmin, marcarLeido);

module.exports = router;