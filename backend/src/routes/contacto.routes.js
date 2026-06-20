const express = require('express');
const router = express.Router();
const { enviarMensaje, listarMensajes, marcarLeido, responderMensaje } = require('../controllers/contacto.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', enviarMensaje);
router.get('/', verifyToken, verifyAdmin, listarMensajes);
router.put('/:id/leido', verifyToken, verifyAdmin, marcarLeido);
router.post('/:id/responder', verifyToken, verifyAdmin, responderMensaje);

module.exports = router;