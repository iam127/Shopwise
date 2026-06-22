const db = require('../db/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const suscribir = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  try {
    const existe = await db.query('SELECT id FROM newsletter WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'Este email ya esta suscrito' });
    }
    await db.query('INSERT INTO newsletter (email) VALUES ($1)', [email]);

    // Email de bienvenida
    await transporter.sendMail({
      from: `"Shopwise" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Shopwise! 🎉',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 40px 32px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Shopwise</h1>
            <p style="color: #bfdbfe; font-size: 14px; margin: 8px 0 0;">Tu tienda de confianza</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 32px; background: #ffffff;">
            <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0 0 12px;">¡Gracias por suscribirte! 🎉</h2>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Ahora eres parte de la comunidad Shopwise. A partir de hoy recibirás:
            </p>

            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 20px; margin-right: 12px;">🏷️</span>
                <span style="color: #334155; font-size: 14px; font-weight: 600;">Ofertas exclusivas antes que nadie</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 20px; margin-right: 12px;">📦</span>
                <span style="color: #334155; font-size: 14px; font-weight: 600;">Novedades de productos recién llegados</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 12px;">⚡</span>
                <span style="color: #334155; font-size: 14px; font-weight: 600;">Descuentos por tiempo limitado</span>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/explorar"
                style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Ver productos ahora →
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              Si no te suscribiste a Shopwise, puedes ignorar este correo.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 20px 32px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 Shopwise · Todos los derechos reservados</p>
          </div>
        </div>
      `,
    });

    res.json({ message: 'Suscripcion exitosa' });
  } catch (error) {
    console.error('Error newsletter:', error);
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

const enviarCampana = async (req, res) => {
  const { asunto, mensaje } = req.body;
  if (!asunto || !mensaje) return res.status(400).json({ message: 'Asunto y mensaje requeridos' });
  try {
    const suscriptores = await db.query('SELECT email FROM newsletter WHERE activo = true');
    if (suscriptores.rows.length === 0) {
      return res.status(400).json({ message: 'No hay suscriptores activos' });
    }

    const emails = suscriptores.rows.map((s) => s.email);

    await transporter.sendMail({
      from: `"Shopwise" <${process.env.EMAIL_USER}>`,
      bcc: emails,
      subject: asunto,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 40px 32px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0;">Shopwise</h1>
            <p style="color: #bfdbfe; font-size: 14px; margin: 8px 0 0;">Tu tienda de confianza</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 32px;">
            <div style="color: #334155; font-size: 15px; line-height: 1.8;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/explorar"
                style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Ver ofertas →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 20px 32px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 Shopwise · Todos los derechos reservados</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Recibiste este correo porque te suscribiste al newsletter de Shopwise.</p>
          </div>
        </div>
      `,
    });

    res.json({ message: `Campaña enviada a ${emails.length} suscriptores` });
  } catch (error) {
    console.error('Error al enviar campaña:', error);
    res.status(500).json({ message: 'Error al enviar la campaña' });
  }
};

module.exports = { suscribir, listar, enviarCampana };