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
const categoriasRoutes = require('./src/routes/categorias.routes');
const productosRoutes = require('./src/routes/productos.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');
const pagosRoutes = require('./src/routes/pagos.routes');
const estadisticasRoutes = require('./src/routes/estadisticas.routes');
const favoritosRoutes = require('./src/routes/favoritos.routes');
const perfilRoutes = require('./src/routes/perfil.routes');
const newsletterRoutes = require('./src/routes/newsletter.routes');
const contactoRoutes = require('./src/routes/contacto.routes');
const ratingsRoutes = require('./src/routes/ratings.routes');

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/ratings', ratingsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});