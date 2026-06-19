const pool = require('../db/db');

const getAllUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, activo, creado_en FROM usuarios ORDER BY creado_en DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

const toggleActivoUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta' });
    }
    const usuario = await pool.query('SELECT activo FROM usuarios WHERE id = $1', [id]);
    if (usuario.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    const nuevoEstado = !usuario.rows[0].activo;
    const result = await pool.query(
      'UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id, nombre, email, rol, activo',
      [nuevoEstado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

const cambiarRolUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  const rolesValidos = ['cliente', 'admin'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }
  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
    }
    const result = await pool.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, nombre, email, rol, activo',
      [rol, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar rol', error: err.message });
  }
};

module.exports = { getAllUsuarios, toggleActivoUsuario, cambiarRolUsuario };