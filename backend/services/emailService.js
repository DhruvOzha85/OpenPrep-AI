const nodemailer = require('nodemailer');

// @desc    Send email using configured SMTP or log to console in dev/test
const sendEmail = async (options) => {
  // If SMTP is not configured, log to console (dev/test fallback)
  if (!process.env.SMTP_HOST) {
    console.log(`\n[EMAIL] To: ${options.to}`);
    console.log(`[EMAIL] Subject: ${options.subject}`);
    console.log(`[EMAIL] Body:\n${options.text}\n`);
    return { success: true, preview: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: process.env.SMTP_FROM || '"OpenPrep AI" <noreply@openprep.ai>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
