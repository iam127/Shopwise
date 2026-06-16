const pool = require('../db/db');

const createPedido = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const carrito = await pool.query('SELECT * FROM carritos WHERE usuario_id = $1', [usuario_id]);
    if (carrito.rows.length === 0) return res.status(404).json({ message: 'Carrito no encontrado' });
    const carrito_id = carrito.rows[0].id;
    const items = await pool.query(`
      SELECT ic.*, p.precio FROM items_carrito ic
      JOIN productos p ON ic.producto_id = p.id
      WHERE ic.carrito_id = $1
    `, [carrito_id]);
    if (items.rows.length === 0) return res.status(400).json({ message: 'El carrito está vacío' });
    const total = items.rows.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const pedido = await pool.query(
      'INSERT INTO pedidos (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, total, 'pendiente']
    );
    const pedido_id = pedido.rows[0].id;
    for (const item of items.rows) {
      await pool.query(
        'INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedido_id, item.producto_id, item.cantidad, item.precio]
      );
    }
    await pool.query('DELETE FROM items_carrito WHERE carrito_id = $1', [carrito_id]);
    res.status(201).json({ message: 'Pedido creado', pedido: pedido.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear pedido', error: err.message });
  }
};

const getPedidos = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY creado_en DESC',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: err.message });
  }
};

const getPedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    if (pedido.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    const items = await pool.query(`
      SELECT ip.*, p.nombre FROM items_pedido ip
      JOIN productos p ON ip.producto_id = p.id
      WHERE ip.pedido_id = $1
    `, [id]);
    res.json({ pedido: pedido.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedido', error: err.message });
  }
};

const getAllPedidos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nombre AS cliente FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.creado_en DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: err.message });
  }
};

module.exports = { createPedido, getPedidos, getPedidoById, getAllPedidos };