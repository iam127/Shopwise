const express = require('express');
const router = express.Router();
const { suscribir, listar } = require('../controllers/newsletter.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', suscribir);
router.get('/', verifyToken, isAdmin, listar);

module.exports = router;