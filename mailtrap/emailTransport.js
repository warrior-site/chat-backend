import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // your Gmail address
    pass: process.env.GMAIL_PASS         // app password
  }
});
//npde tlhx azmx vlda