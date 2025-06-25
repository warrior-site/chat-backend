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
    default: 'https://example.com/default-profile-picture.png'
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
  game: {
    type: String,
    default: ''
  },

  // 🔵 Customization preferences
  theme: {
    type: String,
    default: ''
  },
  font: {
    type: String,
    default: ''
  },
  textSize: {
    type: String,
    default: ''
  },
  chatBackgroundImage: {
    type: String,
    default: ''
  },
  messageSound: {
    type: Boolean,
    default: true
  },

  // 🟢 Friend system
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
