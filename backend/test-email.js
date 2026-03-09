import dotenv from 'dotenv';
import { sendOTP } from './utils/emailService.js';

dotenv.config();

console.log('Testing email configuration...');
console.log('Environment variables loaded:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER);
console.log('- EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);

const testEmail = process.env.EMAIL_USER || 'hendresharvari@gmail.com';
const testOTP = '123456';

console.log(`\nSending test OTP ${testOTP} to ${testEmail}...`);

sendOTP(testEmail, testOTP)
  .then(result => {
    console.log('Test result:', result);
    if (result) {
      console.log('Email sent successfully!');
    } else {
      console.log('Email sending failed!');
    }
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  });