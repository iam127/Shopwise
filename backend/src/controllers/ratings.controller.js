const db = require('../db/db');

const agregarRating = async (req, res) => {
  const { producto_id, rating, comentario } = req.body;
  const usuario_id = req.user.id;
  if (!producto_id || !rating) {
    return res.status(400).json({ message: 'Producto y rating son requeridos' });
  }
  try {
    const existe = await db.query(
      'SELECT id FROM ratings WHERE usuario_id = $1 AND producto_id = $2',
      [usuario_id, producto_id]
    );
    if (existe.rows.length > 0) {
      await db.query(
        'UPDATE ratings SET rating = $1, comentario = $2 WHERE usuario_id = $3 AND producto_id = $4',
        [rating, comentario, usuario_id, producto_id]
      );
      return res.json({ message: 'Rating actualizado' });
    }
    await db.query(
      'INSERT INTO ratings (usuario_id, producto_id, rating, comentario) VALUES ($1, $2, $3, $4)',
      [usuario_id, producto_id, rating, comentario]
    );
    res.json({ message: 'Rating agregado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar rating' });
  }
};

const obtenerRatingProducto = async (req, res) => {
  const { producto_id } = req.params;
  try {
    const result = await db.query(
      'SELECT ROUND(AVG(rating), 1) as promedio, COUNT(*) as total FROM ratings WHERE producto_id = $1',
      [producto_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rating' });
  }
};

const obtenerMiRating = async (req, res) => {
  const { producto_id } = req.params;
  const usuario_id = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM ratings WHERE usuario_id = $1 AND producto_id = $2',
      [usuario_id, producto_id]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rating' });
  }
};

const obtenerTodosRatings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, u.nombre as usuario_nombre, p.nombre as producto_nombre
      FROM ratings r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN productos p ON r.producto_id = p.id
      ORDER BY r.fecha DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ratings' });
  }
};

module.exports = { agregarRating, obtenerRatingProducto, obtenerMiRating, obtenerTodosRatings };