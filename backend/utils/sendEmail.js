const transporter = require('../config/mailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@supportdesk.com',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to} (Message ID: ${result.messageId})`);
    return result;
  } catch (err) {
    console.error(`Email failed to ${to}: ${err.message}`);
    // Email failures should not crash the API.
    return null;
  }
};

module.exports = sendEmail;
