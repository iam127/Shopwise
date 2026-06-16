const pool = require('../db/db');

const getEstadisticas = async (req, res) => {
  try {
    const totalVentas = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM pedidos WHERE estado = 'pagado'"
    );

    const totalPedidos = await pool.query(
      "SELECT COUNT(*) AS total FROM pedidos"
    );

    const totalUsuarios = await pool.query(
      "SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cliente'"
    );

    const totalProductos = await pool.query(
      "SELECT COUNT(*) AS total FROM productos"
    );

    const ventasPorMes = await pool.query(`
      SELECT 
        TO_CHAR(creado_en, 'YYYY-MM') AS mes,
        SUM(total) AS total
      FROM pedidos
      WHERE estado = 'pagado'
      GROUP BY mes
      ORDER BY mes ASC
    `);

    const productosMasVendidos = await pool.query(`
      SELECT 
        p.nombre,
        SUM(ip.cantidad) AS total_vendido
      FROM items_pedido ip
      JOIN productos p ON ip.producto_id = p.id
      JOIN pedidos pe ON ip.pedido_id = pe.id
      WHERE pe.estado = 'pagado'
      GROUP BY p.nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `);

    res.json({
      totalVentas: totalVentas.rows[0].total,
      totalPedidos: totalPedidos.rows[0].total,
      totalUsuarios: totalUsuarios.rows[0].total,
      totalProductos: totalProductos.rows[0].total,
      ventasPorMes: ventasPorMes.rows,
      productosMasVendidos: productosMasVendidos.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: err.message });
  }
};

module.exports = { getEstadisticas };