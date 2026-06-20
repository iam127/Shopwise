const pool = require('../db/db');

// Crear testimonio (cliente logueado)
const crearTestimonio = async (req, res) => {
  const usuario_id = req.user.id;
  const { texto, rating } = req.body;
  if (!texto || !rating) {
    return res.status(400).json({ message: 'Texto y rating son requeridos' });
  }
  try {
    const existe = await pool.query('SELECT id FROM testimonios WHERE usuario_id = $1', [usuario_id]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'Ya has dejado un testimonio anteriormente' });
    }
    const result = await pool.query(
      'INSERT INTO testimonios (usuario_id, texto, rating) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, texto, rating]
    );
    res.status(201).json({ message: 'Testimonio enviado. Sera revisado antes de publicarse.', testimonio: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear testimonio', error: err.message });
  }
};

// Obtener testimonios aprobados (publico)
const getTestimoniosAprobados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.texto, t.rating, t.fecha, u.nombre
      FROM testimonios t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.aprobado = true
      ORDER BY t.fecha DESC
      LIMIT 9
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener testimonios', error: err.message });
  }
};

// Obtener todos los testimonios (admin)
const getTodosTestimonios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.nombre, u.email
      FROM testimonios t
      JOIN usuarios u ON t.usuario_id = u.id
      ORDER BY t.fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener testimonios', error: err.message });
  }
};

// Aprobar/rechazar testimonio (admin)
const toggleAprobarTestimonio = async (req, res) => {
  const { id } = req.params;
  try {
    const testimonio = await pool.query('SELECT aprobado FROM testimonios WHERE id = $1', [id]);
    if (testimonio.rows.length === 0) return res.status(404).json({ message: 'Testimonio no encontrado' });
    const nuevoEstado = !testimonio.rows[0].aprobado;
    const result = await pool.query(
      'UPDATE testimonios SET aprobado = $1 WHERE id = $2 RETURNING *',
      [nuevoEstado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar testimonio', error: err.message });
  }
};

// Eliminar testimonio (admin)
const eliminarTestimonio = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM testimonios WHERE id = $1', [id]);
    res.json({ message: 'Testimonio eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar testimonio', error: err.message });
  }
};

// Verificar si el usuario ya dejo testimonio
const miTestimonio = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM testimonios WHERE usuario_id = $1', [usuario_id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener testimonio', error: err.message });
  }
};

module.exports = {
  crearTestimonio,
  getTestimoniosAprobados,
  getTodosTestimonios,
  toggleAprobarTestimonio,
  eliminarTestimonio,
  miTestimonio,
};