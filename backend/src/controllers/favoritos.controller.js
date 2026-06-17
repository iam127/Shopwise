const pool = require('../db/db');

const getFavoritos = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const result = await pool.query(`
      SELECT f.id, p.* , c.nombre AS categoria
      FROM favoritos f
      JOIN productos p ON f.producto_id = p.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE f.usuario_id = $1
    `, [usuario_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener favoritos', error: err.message });
  }
};

const addFavorito = async (req, res) => {
  const usuario_id = req.user.id;
  const { producto_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO favoritos (usuario_id, producto_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [usuario_id, producto_id]
    );
    res.json({ message: 'Producto agregado a favoritos' });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar favorito', error: err.message });
  }
};

const removeFavorito = async (req, res) => {
  const usuario_id = req.user.id;
  const { producto_id } = req.params;
  try {
    await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
      [usuario_id, producto_id]
    );
    res.json({ message: 'Producto eliminado de favoritos' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar favorito', error: err.message });
  }
};

const checkFavorito = async (req, res) => {
  const usuario_id = req.user.id;
  const { producto_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
      [usuario_id, producto_id]
    );
    res.json({ isFavorito: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar favorito', error: err.message });
  }
};

module.exports = { getFavoritos, addFavorito, removeFavorito, checkFavorito };