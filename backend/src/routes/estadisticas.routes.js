const express = require('express');
const router = express.Router();
const { getEstadisticas } = require('../controllers/estadisticas.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, verifyAdmin, getEstadisticas);

module.exports = router;