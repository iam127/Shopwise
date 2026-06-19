const express = require('express');
const router = express.Router();
const { suscribir, listar } = require('../controllers/newsletter.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', suscribir);
router.get('/', verifyToken, verifyAdmin, listar);

module.exports = router;