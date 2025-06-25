import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
  },
  description: {
    type: String,
    default: '',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  pendingRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  avatar: {
    type: String,
    default: '', // Optional: link to group image
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Group = mongoose.model('Group', groupSchema);
export default Group;
