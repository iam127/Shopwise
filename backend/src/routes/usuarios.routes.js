const express = require('express');
const router = express.Router();
const { getAllUsuarios, toggleActivoUsuario, cambiarRolUsuario } = require('../controllers/usuarios.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, verifyAdmin, getAllUsuarios);
router.put('/:id/toggle-activo', verifyToken, verifyAdmin, toggleActivoUsuario);
router.put('/:id/rol', verifyToken, verifyAdmin, cambiarRolUsuario);

module.exports = router;