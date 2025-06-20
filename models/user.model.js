import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date, 
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png' // Default profile picture URL
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationExpires: {
        type: Date,
        default: null
    },
    usageReason: {
        type: String,
        default: ''
    },
    preferredLanguage: {
        type: String,
        default: 'en'
    },
    game:{
        type: String,
        default: ''
    }

},{timestamps: true});
const User = mongoose.model('User', userSchema);
export default User;