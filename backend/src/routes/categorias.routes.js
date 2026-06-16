const express = require('express');
const router = express.Router();
const { getCategorias, createCategoria, deleteCategoria } = require('../controllers/categorias.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.get('/', getCategorias);
router.post('/', verifyToken, verifyAdmin, createCategoria);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategoria);

module.exports = router;