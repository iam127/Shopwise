const pool = require('../db/db');

const getProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating_promedio,
        COUNT(r.id) AS rating_total
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN ratings r ON r.producto_id = p.id
      WHERE p.activo = true
      GROUP BY p.id, c.nombre
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err.message });
  }
};

const getProductosAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating_promedio,
        COUNT(r.id) AS rating_total
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN ratings r ON r.producto_id = p.id
      GROUP BY p.id, c.nombre
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err.message });
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating_promedio,
        COUNT(r.id) AS rating_total
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN ratings r ON r.producto_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, c.nombre
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto', error: err.message });
  }
};

const createProducto = async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, stock, imagen_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, imagen_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [categoria_id, nombre, descripcion, precio, stock, imagen_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto', error: err.message });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { categoria_id, nombre, descripcion, precio, stock, imagen_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE productos SET categoria_id=$1, nombre=$2, descripcion=$3, precio=$4, stock=$5, imagen_url=$6 WHERE id=$7 RETURNING *',
      [categoria_id, nombre, descripcion, precio, stock, imagen_url, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto', error: err.message });
  }
};

const toggleActivoProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await pool.query('SELECT activo FROM productos WHERE id = $1', [id]);
    if (producto.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    const nuevoEstado = !producto.rows[0].activo;
    const result = await pool.query(
      'UPDATE productos SET activo = $1 WHERE id = $2 RETURNING *',
      [nuevoEstado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado del producto', error: err.message });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto', error: err.message });
  }
};

module.exports = { getProductos, getProductosAdmin, getProductoById, createProducto, updateProducto, toggleActivoProducto, deleteProducto };