const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('./src/db/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Shopwise API funcionando 🚀' });
});

const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});