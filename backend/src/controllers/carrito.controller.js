const pool = require('../db/db');

const getCarrito = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    let carrito = await pool.query('SELECT * FROM carritos WHERE usuario_id = $1', [usuario_id]);
    if (carrito.rows.length === 0) {
      carrito = await pool.query('INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING *', [usuario_id]);
    }
    const carrito_id = carrito.rows[0].id;
    const items = await pool.query(`
      SELECT ic.*, p.nombre, p.precio, p.imagen_url, p.descuento,
        CASE WHEN p.descuento > 0 AND (p.oferta_fin IS NULL OR p.oferta_fin > NOW())
          THEN ROUND(p.precio - (p.precio * p.descuento / 100.0), 2)
          ELSE p.precio
        END AS precio_final
      FROM items_carrito ic
      JOIN productos p ON ic.producto_id = p.id
      WHERE ic.carrito_id = $1
    `, [carrito_id]);
    res.json({ carrito_id, items: items.rows });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener carrito', error: err.message });
  }
};

const addItem = async (req, res) => {
  const usuario_id = req.user.id;
  const { producto_id, cantidad } = req.body;
  try {
    let carrito = await pool.query('SELECT * FROM carritos WHERE usuario_id = $1', [usuario_id]);
    if (carrito.rows.length === 0) {
      carrito = await pool.query('INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING *', [usuario_id]);
    }
    const carrito_id = carrito.rows[0].id;
    const itemExists = await pool.query(
      'SELECT * FROM items_carrito WHERE carrito_id = $1 AND producto_id = $2',
      [carrito_id, producto_id]
    );
    if (itemExists.rows.length > 0) {
      await pool.query(
        'UPDATE items_carrito SET cantidad = cantidad + $1 WHERE carrito_id = $2 AND producto_id = $3',
        [cantidad, carrito_id, producto_id]
      );
    } else {
      await pool.query(
        'INSERT INTO items_carrito (carrito_id, producto_id, cantidad) VALUES ($1, $2, $3)',
        [carrito_id, producto_id, cantidad]
      );
    }
    res.json({ message: 'Producto agregado al carrito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar al carrito', error: err.message });
  }
};

const removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items_carrito WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar del carrito', error: err.message });
  }
};

const clearCarrito = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const carrito = await pool.query('SELECT * FROM carritos WHERE usuario_id = $1', [usuario_id]);
    if (carrito.rows.length === 0) return res.status(404).json({ message: 'Carrito no encontrado' });
    await pool.query('DELETE FROM items_carrito WHERE carrito_id = $1', [carrito.rows[0].id]);
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al vaciar carrito', error: err.message });
  }
};

module.exports = { getCarrito, addItem, removeItem, clearCarrito };