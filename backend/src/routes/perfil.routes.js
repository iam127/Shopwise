const express = require('express');
const router = express.Router();
const { getPerfil, updatePerfil, updatePassword } = require('../controllers/perfil.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getPerfil);
router.put('/', verifyToken, updatePerfil);
router.put('/password', verifyToken, updatePassword);

module.exports = router;