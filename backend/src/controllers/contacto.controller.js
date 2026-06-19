const db = require('../db/db');

const enviarMensaje = async (req, res) => {
  const { nombre, email, asunto, mensaje, tipo } = req.body;
  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  try {
    await db.query(
      'INSERT INTO contacto (nombre, email, asunto, mensaje, tipo) VALUES ($1, $2, $3, $4, $5)',
      [nombre, email, asunto, mensaje, tipo || 'consulta']
    );
    res.json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
};

const listarMensajes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contacto ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

const marcarLeido = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE contacto SET leido = true WHERE id = $1', [id]);
    res.json({ message: 'Mensaje marcado como leido' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar mensaje' });
  }
};

module.exports = { enviarMensaje, listarMensajes, marcarLeido };