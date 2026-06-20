const pool = require('../db/db');

const getStatsPublicas = async (req, res) => {
  try {
    const productos = await pool.query("SELECT COUNT(*) FROM productos WHERE activo = true");
    const clientes = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente'");
    const ratingPromedio = await pool.query("SELECT COALESCE(ROUND(AVG(rating), 1), 0) as promedio, COUNT(*) as total FROM ratings");
    const categorias = await pool.query("SELECT COUNT(*) FROM categorias");

    res.json({
      totalProductos: parseInt(productos.rows[0].count),
      totalClientes: parseInt(clientes.rows[0].count),
      ratingPromedio: parseFloat(ratingPromedio.rows[0].promedio),
      totalRatings: parseInt(ratingPromedio.rows[0].total),
      totalCategorias: parseInt(categorias.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadisticas', error: err.message });
  }
};

module.exports = { getStatsPublicas };