const express = require('express');
const router = express.Router();
const { getStatsPublicas } = require('../controllers/stats-publicas.controller');

router.get('/', getStatsPublicas);

module.exports = router;