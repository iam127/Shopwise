const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarRespuesta = async (destinatario, asuntoOriginal, mensajeOriginal, respuesta) => {
  try {
    await transporter.sendMail({
      from: `"Shopwise Soporte" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: 'Re: ' + asuntoOriginal,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #2563eb, #1e40af); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">Shopwise</h2>
          </div>
          <div style="padding: 24px; background: #f9fafb; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 14px;">Hola,</p>
            <p style="color: #374151; font-size: 14px;">Gracias por contactarnos. Aquí está nuestra respuesta a tu consulta:</p>
            <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
              <p style="color: #1f2937; font-size: 14px; white-space: pre-wrap;">${respuesta}</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Tu mensaje original: "${mensajeOriginal}"</p>
            <p style="color: #374151; font-size: 14px; margin-top: 24px;">Saludos,<br/>Equipo Shopwise</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error.message);
    return false;
  }
};

module.exports = { enviarRespuesta };