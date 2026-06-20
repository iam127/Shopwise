const db = require('../db/db');
const { enviarRespuesta } = require('../utils/mailer');

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

const responderMensaje = async (req, res) => {
  const { id } = req.params;
  const { respuesta } = req.body;
  if (!respuesta || !respuesta.trim()) {
    return res.status(400).json({ message: 'La respuesta no puede estar vacía' });
  }
  try {
    const mensajeResult = await db.query('SELECT * FROM contacto WHERE id = $1', [id]);
    if (mensajeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    const mensajeOriginal = mensajeResult.rows[0];

    const enviado = await enviarRespuesta(
      mensajeOriginal.email,
      mensajeOriginal.asunto,
      mensajeOriginal.mensaje,
      respuesta
    );

    if (!enviado) {
      return res.status(500).json({ message: 'No se pudo enviar el correo. Verifica la configuración de email.' });
    }

    const result = await db.query(
      'UPDATE contacto SET respuesta = $1, respondido_en = NOW(), leido = true WHERE id = $2 RETURNING *',
      [respuesta, id]
    );
    res.json({ message: 'Respuesta enviada correctamente', mensaje: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al responder mensaje', error: error.message });
  }
};

module.exports = { enviarMensaje, listarMensajes, marcarLeido, responderMensaje };