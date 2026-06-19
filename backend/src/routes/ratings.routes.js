const express = require('express');
const router = express.Router();
const { agregarRating, obtenerRatingProducto, obtenerMiRating, obtenerTodosRatings } = require('../controllers/ratings.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, agregarRating);
router.get('/producto/:producto_id', obtenerRatingProducto);
router.get('/mi-rating/:producto_id', verifyToken, obtenerMiRating);
router.get('/', verifyToken, verifyAdmin, obtenerTodosRatings);

module.exports = router;