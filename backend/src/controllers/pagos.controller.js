const pool = require('../db/db');

const procesarPago = async (req, res) => {
  const { pedido_id, metodo } = req.body;
  try {
    const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [pedido_id]);
    if (pedido.rows.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    if (pedido.rows[0].estado === 'pagado') return res.status(400).json({ message: 'El pedido ya fue pagado' });
    const estadoPago = Math.random() > 0.1 ? 'aprobado' : 'rechazado';
    const pago = await pool.query(
      'INSERT INTO pagos (pedido_id, monto, metodo, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [pedido_id, pedido.rows[0].total, metodo, estadoPago]
    );
    if (estadoPago === 'aprobado') {
      await pool.query('UPDATE pedidos SET estado = $1 WHERE id = $2', ['pagado', pedido_id]);
    }
    res.json({ message: `Pago ${estadoPago}`, pago: pago.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar pago', error: err.message });
  }
};

const getPagoByPedido = async (req, res) => {
  const { pedido_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM pagos WHERE pedido_id = $1', [pedido_id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pago', error: err.message });
  }
};

module.exports = { procesarPago, getPagoByPedido };