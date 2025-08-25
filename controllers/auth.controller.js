import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { setCookies } from '../utils/setCookies.js';
import User from '../models/user.model.js';
// import { sendVerificationEmail, welcomeEmail } from '../mailtrap/email.js';
import { sendVerificationEmail,sendWelcomeEmail  } from '../mailtrap/emailService.js';
// import sendEmail from '../mailtrap/ResendEmailService.js';



export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "User is authenticated",
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            }
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(Math.random() * 900000) + 100000; // Generate a random 6-digit verification token
        const newUser = new User({
            email,                        
            username,
            password: hashedPassword,
            verificationToken, // Store the verification token
            verificationExpires: Date.now() + 24 * 60 * 60 * 1000 // Token valid for 24 hours
        });
        await newUser.save();
        setCookies(res, newUser._id);
        // await sendVerificationEmail(newUser.email, verificationToken); // Send verification email
        // console.log("Sending email to:", newUser.email);
        // await sendEmail(newUser.email,verificationToken);
        console.log('New user registered:', newUser.email);
        // await sendVerificationEmail(newUser.email, verificationToken); // Send verification email
        // console.log("email sent")
        res.status(201).json({
            message: 'User registered successfully', newUser: {
                ...newUser._doc,
                password: undefined // Exclude password from response
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // ❌ You used `mongoose.findOne()` instead of querying the model
        // ✅ Corrected to use `User.findOne()` and await it
        const user = await User.findOne({ verificationToken: code });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // if (user.verificationTokenExpires < Date.now()) {
        //     return res.status(400).json({ message: 'Verification code expired' });
        // }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        // await welcomeEmail(user.email); // sending welcome mail
        // await sendWelcomeEmail(user.email); // sending welcome mail

        console.log('User email verified successfully:', user.email);

        res.status(200).json({
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Server error during email verification" });
    }
};
export const logout = async (req, res) => {
    try {
        // Clear cookies by setting them to empty
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
        console.log('User logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        setCookies(res, user._id);

        res.status(200).json({
            message: 'Login successful',
            user: {
                ...user._doc,
                password: undefined // Exclude password from response
            }
        });
        console.log('User logged in successfully:', user.email);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const forgotPassword = async (req, res) => {
}
export const resetPassword = async (req, res) => {
    
}