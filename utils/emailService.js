const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Create a Nodemailer transporter using environment variables.
 * If required environment variables are missing, returns null and emails
 * will be logged to the console instead of being sent.
 */
function createTransporter() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE } = process.env;

    // Basic check that credentials exist
    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        console.warn('[emailService] Email environment variables are missing. Emails will be logged to console.');
        return null;
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT, 10),
        secure: EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}

const transporter = createTransporter();

/**
 * Send an email.
 * @param {Object} options { to: string, subject: string, html?: string, text?: string }
 */
async function sendEmail(options) {
    const { to, subject, html, text } = options;

    if (!transporter) {
        // Development fallback – log the email contents
        console.log('[emailService] Sending email (DEV Fallback):');
        console.log('To:', to);
        console.log('Subject:', subject);
        if (text) console.log('Text:', text);
        if (html) console.log('HTML:', html);
        return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Locket" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });
}

module.exports = {
    sendEmail
}; 