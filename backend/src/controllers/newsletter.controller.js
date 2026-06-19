const db = require('../db/db');

const suscribir = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  try {
    const existe = await db.query('SELECT id FROM newsletter WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'Este email ya esta suscrito' });
    }
    await db.query('INSERT INTO newsletter (email) VALUES ($1)', [email]);
    res.json({ message: 'Suscripcion exitosa' });
  } catch (error) {
    res.status(500).json({ message: 'Error al suscribirse' });
  }
};

const listar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM newsletter ORDER BY fecha_suscripcion DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener suscriptores' });
  }
};

module.exports = { suscribir, listar };