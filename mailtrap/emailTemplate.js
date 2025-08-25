export const VERIFICATION_EMAIL_TEMPLATE = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f3f3f3; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4F46E5;">Welcome to Chatify 👋</h2>
        <p>We're excited to have you on board.</p>
        <p>Please verify your email using the following code:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4F46E5; margin-top: 20px; text-align: center;">
          {verificationCode}
        </div>
        <p style="margin-top: 30px;">If you did not sign up for Chatify, you can ignore this message.</p>
        <p>— The Chatify Team</p>
        <p>This is a test email sent using Resend’s development email — please ignore if not expected</p>
      </div>
    </body>
  </html>
`;
 

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 600px;
      margin: auto;
    }
    .header {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      background: linear-gradient(to right, #4f46e5, #9333ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
    }
    .unsubscribe {
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
    .unsubscribe a {
      color: #8888ff;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Welcome to your Chatify Dashboard!</div>
    <p>Hey <strong>{username}</strong>,</p>
    <p>We're thrilled to have you on board. Start chatting, meet people, and have fun!</p>
    <p>If you ever need help, just reply to this email. 💬</p>

    <p style="text-align: center; margin-top: 30px;">
      <a href="https://your-app-url.com/dashboard" style="
        display: inline-block;
        background: #ffffff;
        color: #4f46e5;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: bold;
        text-decoration: none;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease-in-out;
      ">
        Go to Dashboard
      </a>
    </p>

    <p>– The Chatify Team</p>
    <div class="unsubscribe">
      Don't want to receive emails from us? <a href="#">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
`;


export const RESET_PASSWORD_EMAIL_TEMPLATE = (username, resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .button { background: #ef4444; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>Hello <strong>${username}</strong>,</p>
    <p>It seems you requested a password reset. Click below to continue:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>– The ChatApp Team</p>
  </div>
</body>
</html>
`;

export const RESET_SUCCESS_TEMPLATE = (username) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h2 { color: #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Successful</h2>
    <p>Hey <strong>${username}</strong>,</p>
    <p>Your password was successfully changed. You can now log in with your new credentials.</p>
    <p>If you didn’t perform this action, contact support immediately.</p>
    <p>– The ChatApp Team</p>
  </div>
</body>
</html>
`;
