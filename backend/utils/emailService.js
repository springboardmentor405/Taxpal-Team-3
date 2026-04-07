import nodemailer from 'nodemailer';

/*
  ─── GMAIL SETUP — READ THIS IF EMAIL IS FAILING ─────────────────────────────
  The error "530 5.7.0 Authentication Required" means your App Password is
  invalid, expired, or your Google account doesn't have 2-Step Verification on.

  Steps to fix:
  1. Go to https://myaccount.google.com/security
  2. Make sure "2-Step Verification" is ON (required for App Passwords)
  3. Go to https://myaccount.google.com/apppasswords
  4. Create a new App Password → select "Mail" + "Other (Custom name)" → "TaxPal"
  5. Copy the 16-character password Google gives you (no spaces)
  6. In backend/.env set:
       EMAIL_USER=your-gmail@gmail.com
       EMAIL_PASS=xxxxxxxxxxxxxxxxxxxx   ← the 16-char app password, no spaces
  7. Restart the backend server

  NOTE: Do NOT use your regular Gmail login password — it will not work.
        Only the App Password (16 chars, generated on the page above) works.
  ─────────────────────────────────────────────────────────────────────────────
*/

// Warn at startup if credentials look wrong
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('[emailService] WARNING: EMAIL_USER or EMAIL_PASS is not set in .env — OTP emails will fail.');
} else if (process.env.EMAIL_PASS.replace(/\s/g, '').length !== 16) {
  console.warn('[emailService] WARNING: EMAIL_PASS does not look like a valid 16-character Gmail App Password. Check your .env.');
}

// Create transporter once at module load (connection pooling)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '',
  },
  tls: { rejectUnauthorized: false },
  pool: true,
  maxConnections: 3,
});

export const sendOTP = async (email, otp) => {
  try {
    console.log('[emailService] Sending OTP to:', email);

    const info = await transporter.sendMail({
      from: `"TaxPal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your TaxPal Password Reset OTP',
      text: `Your TaxPal OTP is: ${otp}\nThis code expires in 5 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0a0a3a; text-align: center; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #555; text-align: center; margin-bottom: 28px;">Use the code below to reset your TaxPal password.</p>
          <div style="text-align: center; margin: 0 auto 28px; background: #f3f4f6; border-radius: 10px; padding: 20px; width: fit-content; min-width: 160px;">
            <span style="font-size: 36px; font-weight: 800; color: #1C88C7; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #888; text-align: center; font-size: 13px;">This code expires in <strong>5 minutes</strong>. If you didn't request a reset, ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #aaa; text-align: center; font-size: 12px;">TaxPal &mdash; Your Financial Companion</p>
        </div>
      `,
    });

    console.log('[emailService] OTP sent successfully. MessageId:', info.messageId);
    return true;
  } catch (error) {
    console.error('[emailService] Failed to send OTP email:', error.message);
    if (error.code === 'EAUTH' || error.responseCode === 530 || error.responseCode === 535) {
      console.error(
        '[emailService] ── AUTH ERROR ──────────────────────────────────────────\n' +
        '  Your Gmail App Password is invalid or expired.\n' +
        '  1. Visit https://myaccount.google.com/apppasswords\n' +
        '  2. Generate a new 16-character App Password for "Mail"\n' +
        '  3. Update EMAIL_PASS in backend/.env (no spaces)\n' +
        '  4. Restart the server\n' +
        '──────────────────────────────────────────────────────────────'
      );
    }
    return false;
  }
};
