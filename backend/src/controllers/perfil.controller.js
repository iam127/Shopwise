const pool = require('../db/db');
const bcrypt = require('bcryptjs');

const getPerfil = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, telefono, direccion FROM usuarios WHERE id = $1',
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
};

const updatePerfil = async (req, res) => {
  const usuario_id = req.user.id;
  const { nombre, email, telefono, direccion } = req.body;
  try {
    const emailExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND id != $2',
      [email, usuario_id]
    );
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, telefono = $3, direccion = $4 WHERE id = $5 RETURNING id, nombre, email, rol, telefono, direccion',
      [nombre, email, telefono || null, direccion || null, usuario_id]
    );
    res.json({ message: 'Perfil actualizado', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

const updatePassword = async (req, res) => {
  const usuario_id = req.user.id;
  const { password_actual, password_nueva } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password_actual, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }
    const password_hash = await bcrypt.hash(password_nueva, 10);
    await pool.query(
      'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
      [password_hash, usuario_id]
    );
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar contraseña', error: err.message });
  }
};

module.exports = { getPerfil, updatePerfil, updatePassword };