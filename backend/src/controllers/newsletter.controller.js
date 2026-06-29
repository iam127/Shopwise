const db = require('../db/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const FRONTEND = process.env.FRONTEND_URL || 'https://shopwise-olive.vercel.app';
const LOGO_URL = `${FRONTEND}/logo.png`;

const suscribir = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  try {
    const existe = await db.query('SELECT id FROM newsletter WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'Este email ya esta suscrito' });
    }
    await db.query('INSERT INTO newsletter (email) VALUES ($1)', [email]);

    await transporter.sendMail({
      from: `"Shopwise" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Shopwise! 🎉',
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:40px;text-align:center;">
            <img src="${LOGO_URL}" alt="Shopwise" width="160" style="display:block;margin:0 auto 12px;filter:brightness(0) invert(1);" />
            <p style="color:#bfdbfe;font-size:13px;margin:0;">Tu tienda de confianza</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="color:#1e293b;font-size:22px;font-weight:700;margin:0 0 12px;">¡Gracias por suscribirte! 🎉</h2>
            <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">Ahora eres parte de la comunidad Shopwise. A partir de hoy recibirás:</p>
            <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 12px;color:#334155;font-size:14px;font-weight:600;">🏷️ Ofertas exclusivas antes que nadie</p>
              <p style="margin:0 0 12px;color:#334155;font-size:14px;font-weight:600;">📦 Novedades de productos recién llegados</p>
              <p style="margin:0;color:#334155;font-size:14px;font-weight:600;">⚡ Descuentos por tiempo limitado</p>
            </div>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${FRONTEND}/explorar" style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;">
                Ver productos ahora →
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">Si no te suscribiste a Shopwise, puedes ignorar este correo.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f1f5f9;padding:20px 40px;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 Shopwise · Todos los derechos reservados</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
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
    const fecha = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
    const mensajeHtml = mensaje.replace(/\n/g, '<br>');

    await transporter.sendMail({
      from: `"Shopwise" <${process.env.EMAIL_USER}>`,
      bcc: emails,
      subject: asunto,
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${asunto}</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:40px;text-align:center;">
            <img src="${LOGO_URL}" alt="Shopwise" width="160" style="display:block;margin:0 auto 16px;filter:brightness(0) invert(1);" />
            <div style="width:48px;height:2px;background:rgba(255,255,255,0.4);border-radius:99px;margin:0 auto 16px;"></div>
            <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 8px;line-height:1.3;">${asunto}</h1>
            <p style="color:#93c5fd;font-size:12px;margin:0;">${fecha}</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="color:#1e293b;font-size:16px;font-weight:700;margin:0 0 8px;">Hola 👋</p>
            <p style="color:#64748b;font-size:14px;line-height:1.7;margin:0 0 24px;">Tenemos un mensaje especial para ti como parte de la comunidad Shopwise.</p>
            <div style="height:1px;background:#e2e8f0;margin:0 0 24px;"></div>

            <!-- Mensaje -->
            <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:0 12px 12px 0;padding:24px 20px;margin-bottom:32px;">
              <p style="color:#334155;font-size:15px;line-height:1.8;margin:0;">${mensajeHtml}</p>
            </div>

            <!-- Beneficios -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="33%" style="padding:0 4px 0 0;vertical-align:top;">
                  <div style="background:#eff6ff;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">🚚</div>
                    <p style="color:#1e40af;font-size:11px;font-weight:700;margin:0;">Envío gratis</p>
                    <p style="color:#3b82f6;font-size:10px;margin:3px 0 0;">En compras +S/.100</p>
                  </div>
                </td>
                <td width="33%" style="padding:0 2px;vertical-align:top;">
                  <div style="background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">🔒</div>
                    <p style="color:#15803d;font-size:11px;font-weight:700;margin:0;">Compra segura</p>
                    <p style="color:#16a34a;font-size:10px;margin:3px 0 0;">Pago 100% protegido</p>
                  </div>
                </td>
                <td width="33%" style="padding:0 0 0 4px;vertical-align:top;">
                  <div style="background:#fef3c7;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:22px;margin-bottom:6px;">⭐</div>
                    <p style="color:#92400e;font-size:11px;font-weight:700;margin:0;">Garantía</p>
                    <p style="color:#d97706;font-size:10px;margin:3px 0 0;">30 días garantizados</p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${FRONTEND}/explorar"
                style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:12px;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
                Ver productos y ofertas →
              </a>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <img src="${LOGO_URL}" alt="Shopwise" width="100" style="display:block;margin:0 auto 12px;opacity:0.5;" />
            <div style="margin-bottom:12px;">
              <a href="${FRONTEND}/explorar" style="color:#3b82f6;font-size:12px;text-decoration:none;margin:0 8px;">Productos</a>
              <span style="color:#e2e8f0;">|</span>
              <a href="${FRONTEND}/nosotros" style="color:#3b82f6;font-size:12px;text-decoration:none;margin:0 8px;">Nosotros</a>
              <span style="color:#e2e8f0;">|</span>
              <a href="${FRONTEND}/contacto" style="color:#3b82f6;font-size:12px;text-decoration:none;margin:0 8px;">Contacto</a>
            </div>
            <p style="color:#cbd5e1;font-size:11px;margin:0;">© 2026 Shopwise · Todos los derechos reservados</p>
            <p style="color:#cbd5e1;font-size:11px;margin:6px 0 0;">Recibiste este correo porque te suscribiste al newsletter de Shopwise.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
      `,
    });

    res.json({ message: `Campaña enviada a ${emails.length} suscriptores` });
  } catch (error) {
    console.error('Error al enviar campaña:', error);
    res.status(500).json({ message: 'Error al enviar la campaña' });
  }
};

module.exports = { suscribir, listar, enviarCampana };