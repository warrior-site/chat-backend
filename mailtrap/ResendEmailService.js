import { Resend } from 'resend';
import dotenv from "dotenv";
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, verificationToken) => {
  try {
    console.log('📩 Preparing to send email...');
    console.log('✅ Resend API Key loaded:', process.env.RESEND_API_KEY ? 'Yes' : 'No');
    console.log('📨 Sending to:', to);
    console.log('🔑 Verification code:', verificationToken);

    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken);
    console.log('📝 Email HTML content:', htmlContent);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verify your email',
      html: htmlContent
    });

    console.log('✅ Email sent successfully!');
    console.log('📦 Resend Response:', response);
    return response;

  } catch (error) {
    console.error('❌ Error sending email:', error?.message || error);
    throw error;
  }
};

export default sendEmail;
