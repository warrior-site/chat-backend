import { MailtrapClient } from "mailtrap";
import { sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, token) => {
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
            category: "Verification Email",
        })
        console.log("Email sent successfully:", response);
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error.message}`);
        console.error("Error sending email:", error);
    }
}
export const welcomeEmail = async (email) => {
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Welcome to our service",
            html: WELCOME_EMAIL_TEMPLATE,
            category: "Welcome Email",
        });
        console.log("Welcome email sent successfully:", response);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
}