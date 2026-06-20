const pool = require('../db/db');

const getProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating_promedio,
        COUNT(r.id) AS rating_total,
        CASE WHEN p.descuento > 0 AND (p.oferta_fin IS NULL OR p.oferta_fin > NOW())
          THEN ROUND(p.precio - (p.precio * p.descuento / 100.0), 2)
          ELSE NULL
        END AS precio_oferta
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
        COUNT(r.id) AS rating_total,
        CASE WHEN p.descuento > 0 AND (p.oferta_fin IS NULL OR p.oferta_fin > NOW())
          THEN ROUND(p.precio - (p.precio * p.descuento / 100.0), 2)
          ELSE NULL
        END AS precio_oferta
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

const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating_promedio,
        COUNT(r.id) AS rating_total,
        ROUND(p.precio - (p.precio * p.descuento / 100.0), 2) AS precio_oferta
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN ratings r ON r.producto_id = p.id
      WHERE p.activo = true AND p.descuento > 0 AND (p.oferta_fin IS NULL OR p.oferta_fin > NOW())
      GROUP BY p.id, c.nombre
      ORDER BY p.descuento DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener ofertas', error: err.message });
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

const setOfertaProducto = async (req, res) => {
  const { id } = req.params;
  const { descuento, oferta_fin } = req.body;
  if (descuento === undefined || descuento < 0 || descuento > 90) {
    return res.status(400).json({ message: 'El descuento debe estar entre 0 y 90' });
  }
  try {
    const result = await pool.query(
      'UPDATE productos SET descuento = $1, oferta_fin = $2 WHERE id = $3 RETURNING *',
      [descuento, oferta_fin || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar oferta', error: err.message });
  }
};

const quitarOfertaProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE productos SET descuento = 0, oferta_fin = NULL WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al quitar oferta', error: err.message });
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

module.exports = {
  getProductos,
  getProductosAdmin,
  getProductoById,
  getOfertas,
  createProducto,
  updateProducto,
  setOfertaProducto,
  quitarOfertaProducto,
  toggleActivoProducto,
  deleteProducto,
};