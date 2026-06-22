const pool = require('../db/db');

const getStatsPublicas = async (req, res) => {
  try {
    const productos = await pool.query("SELECT COUNT(*) FROM productos WHERE activo = true");
    const clientes = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente'");
    const ratingPromedio = await pool.query("SELECT COALESCE(ROUND(AVG(rating), 1), 0) as promedio, COUNT(*) as total FROM ratings");
    const categorias = await pool.query("SELECT COUNT(*) FROM categorias");

    // Consultas resueltas = mensajes de contacto que han sido respondidos
    const consultasResueltas = await pool.query(
      "SELECT COUNT(*) FROM contacto WHERE respondido_en IS NOT NULL"
    );

    // Satisfaccion real = porcentaje de ratings >= 4 sobre el total
    const satisfaccion = await pool.query(`
      SELECT
        CASE WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND((COUNT(*) FILTER (WHERE rating >= 4) * 100.0 / COUNT(*)), 0)
        END AS porcentaje
      FROM ratings
    `);

    res.json({
      totalProductos: parseInt(productos.rows[0].count),
      totalClientes: parseInt(clientes.rows[0].count),
      ratingPromedio: parseFloat(ratingPromedio.rows[0].promedio),
      totalRatings: parseInt(ratingPromedio.rows[0].total),
      totalCategorias: parseInt(categorias.rows[0].count),
      consultasResueltas: parseInt(consultasResueltas.rows[0].count),
      satisfaccion: parseInt(satisfaccion.rows[0].porcentaje),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadisticas', error: err.message });
  }
};

module.exports = { getStatsPublicas };