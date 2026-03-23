import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to send OTP to:', email);

    const mailOptions = {
      from: `"TaxPal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - TaxPal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 10px 20px; border-radius: 5px; letter-spacing: 3px;">${otp}</span>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Best regards,<br>TaxPal Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Check your App Password in .env!');
    }
    return false;
  }
};