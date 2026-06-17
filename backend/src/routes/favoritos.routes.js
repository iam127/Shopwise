const express = require('express');
const router = express.Router();
const { getFavoritos, addFavorito, removeFavorito, checkFavorito } = require('../controllers/favoritos.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getFavoritos);
router.post('/', verifyToken, addFavorito);
router.delete('/:producto_id', verifyToken, removeFavorito);
router.get('/check/:producto_id', verifyToken, checkFavorito);

module.exports = router;