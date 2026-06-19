const pool = require('../db/db');

const getCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
};

const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear categoría', error: err.message });
  }
};

const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar categoría', error: err.message });
  }
};

const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const productosAsociados = await pool.query('SELECT COUNT(*) FROM productos WHERE categoria_id = $1', [id]);
    if (parseInt(productosAsociados.rows[0].count) > 0) {
      return res.status(400).json({ message: 'No se puede eliminar: hay productos asociados a esta categoría' });
    }
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar categoría', error: err.message });
  }
};

module.exports = { getCategorias, createCategoria, updateCategoria, deleteCategoria };