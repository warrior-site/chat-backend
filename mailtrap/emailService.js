import dotenv from 'dotenv';

dotenv.config();
import { transporter } from './emailTransport.js';
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './emailTemplate.js';

export const sendVerificationEmail = async (email, token) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', token);

  const mailOptions = {
    from: `"Chat App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html,
  };

  console.log('Sending verification email to:', email);
  console.log('Verification token:', token);
  console.log('Mail options:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
  } catch (err) {
    console.error('Email send error (verification):', err);
    throw new Error('Failed to send verification email');
  }
};

export const sendWelcomeEmail = async (email) => {
  const mailOptions = {
    from: `"Chat App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Chat App',
    html: WELCOME_EMAIL_TEMPLATE,
  };

  console.log('Sending welcome email to:', email);
  console.log('Mail options:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
  } catch (err) {
    console.error('Email send error (welcome):', err);
    throw new Error('Failed to send welcome email');
  }
};
