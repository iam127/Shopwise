const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

const upload = multer({ storage });

router.post('/imagen', verifyToken, verifyAdmin, upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }
  res.json({ url: req.file.path });
});

module.exports = router;