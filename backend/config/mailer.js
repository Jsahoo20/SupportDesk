const nodemailer = require('nodemailer');

let transporter;

// Mock mailer for development (no real SMTP credentials)
if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
  transporter = {
    sendMail: async (mailOptions) => {
      console.log(`[MOCK EMAIL] To: ${mailOptions.to}`);
      console.log(`[MOCK EMAIL] Subject: ${mailOptions.subject}`);
      return { messageId: 'mock-id-' + Date.now() };
    },
  };
} else {
  // Real SMTP setup
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

module.exports = transporter;
