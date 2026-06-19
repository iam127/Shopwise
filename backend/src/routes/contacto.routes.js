const express = require('express');
const router = express.Router();
const { enviarMensaje, listarMensajes, marcarLeido } = require('../controllers/contacto.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', enviarMensaje);
router.get('/', verifyToken, isAdmin, listarMensajes);
router.put('/:id/leido', verifyToken, isAdmin, marcarLeido);

module.exports = router;