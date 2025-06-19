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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send verification email');
  }
};
export const sendWelcomeEmail = async (email) => {
  const mailOptions = {
    from: `"Chat App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Chat App',
    // text: 'Thank you for verifying your email. Welcome to Chat App!',
    html:WELCOME_EMAIL_TEMPLATE
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send welcome email');
  }
};