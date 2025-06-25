import express from "express";
import User from "../models/user.model.js";
import cloudinary from "../cloudinary/cloudinary.config.js";
import fs from "fs";
import Group from "../models/createGroup.model.js";
import mongoose from "mongoose"

export const profile = async (req, res) => {
  const { email, language, usageReason, game } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    // ✅ 1. Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Delete temp file

    const imageUrl = result.secure_url;

    // ✅ 2. Prepare update object
    const updateData = {
      preferredLanguage: language,
      usageReason,
      profilePicture: imageUrl,
      ...(usageReason === "Gaming" && game ? { game } : {}), // Add game only if usageReason is Gaming
    };

    // ✅ 3. Update user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "✅ Profile updated", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const uploadPreferences = async (req, res) => {
  const { theme, font, textSize, soundEnabled, backgroundImage, user } = req.body;
  const email = typeof user === "string" ? user : user?.email;
  try {
    // ✅ 1. Validate input
    if (!theme || !font || !textSize) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("🧾 req.body:", req.body);
    console.log("🖼 req.file:", req.file);


    let uploadedBackgroundImage = backgroundImage;

    // ✅ 2. Upload backgroundImage to Cloudinary if file is present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // Delete temp file
      uploadedBackgroundImage = result.secure_url;
    }

    // ✅ 3. Update user preferences
    const updatedUser = await User.findOneAndUpdate(
      { email }, // or req.user.email if using auth middleware
      {
        theme: req.body.theme,
        font: req.body.font,
        textSize: req.body.textSize,
        messageSound: req.body.soundEnabled === "true",
        chatBackgroundImage: uploadedBackgroundImage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "✅ Preferences updated", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating preferences:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const createGroup = async (req, res) => {
  
console.log("📌 Hit createGroup route");
  const { groupName, description, isPrivate, avatar, allowMedia, allowMentions,userId } = req.body;
  let avatarUrl = avatar;

  // If avatar is a file upload (req.file), upload to Cloudinary
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Delete temp file
    avatarUrl = result.secure_url;
  } else if (avatar && avatar.startsWith("data:")) {
    // If avatar is a base64 data URL, upload to Cloudinary
    const result = await cloudinary.uploader.upload(avatar, { upload_preset: "ml_default" });
    avatarUrl = result.secure_url;
  }
  try {
    // ✅ Check if group with same name exists
    const existing = await Group.findOne({ groupName });
    if (existing) {
      return res.status(400).json({ message: "Group with this name already exists" });
    }
// const hardcodedAdminId = new mongoose.Types.ObjectId("64a7eaaa11aabbccddeeff00");
    // ✅ Create group (skip Cloudinary if no image logic yet)
    const newGroup = new Group({
      groupName,
      description,
      isPrivate,
      avatar: avatarUrl,
      allowMedia,
      allowMentions,
      admin: userId,
      members: [userId],
    });
//req.user._id ||

    await newGroup.save();
    return res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const searchUserOrGroup = async (req, res) => {
  const { type, q } = req.query;

  if (!q || !type) {
    return res.status(400).json({ message: "Missing query or type" });
  }

  try {
    let results = [];

    if (type === 'user') {
      results = await User.find({
        username: { $regex: q, $options: 'i' }
      }).select('_id username profilePicture');
    } else if (type === 'group') {
      results = await Group.find({
        groupName: { $regex: q, $options: 'i' }
      }).select('_id groupName avatar');
    } else {
      return res.status(400).json({ message: "Invalid search type" });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const sendFriendRequest = async (req, res) => {
  const { targetUserId } = req.body;
  const currentUserId = req.body.user._id;

  if (targetUserId === currentUserId) return res.status(400).json({ message: "Can't add yourself" });

  const sender = await User.findById(currentUserId);
  const receiver = await User.findById(targetUserId);

  if (!receiver) return res.status(404).json({ message: "User not found" });

  if (receiver.friendRequests.includes(currentUserId)) {
    return res.status(400).json({ message: "Already sent request" });
  }

  receiver.friendRequests.push(currentUserId);
  sender.sentRequests.push(targetUserId);
  await receiver.save();
  await sender.save();

  res.status(200).json({ message: "Friend request sent" });
};
export const joinGroupRequest = async (req, res) => {
 const { groupId, user } = req.body;
 const userId=user._id;
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.members.includes(userId) || group.pendingRequests.includes(userId)) {
    return res.status(400).json({ message: "Already joined or pending" });
  }

  group.pendingRequests.push(userId);
  await group.save();

  res.status(200).json({ message: "Group join request sent" });
};
export const fetchFriends = async (req, res) => {
  try {
    const{user}=req.body
    const currentUserId = user._id;

    const user1 = await User.findById(currentUserId).populate('friends', 'username email profilePicture');

    if (!user1) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user1.friends);
  } catch (err) {
    console.error('❌ Error fetching friends:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const fetchGroups = async (req, res) => {
  try {
    const{user}=req.body
    const userId = user._id;

    const groups = await Group.find({ members: userId })
      .select('groupName avatar isPrivate')
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const acceptFriendRequest = async (req, res) => {
  try {
    const { user, senderId } = req.body; // user = current logged-in user who received the request

    const receiver = await User.findById(user._id);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) return res.status(404).json({ message: "User not found" });

    // Remove from pending
    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== user._id);

    // Add to friends
    receiver.friends.push(senderId);
    sender.friends.push(user._id);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('❌ Accept request error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getFriendRequests = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user._id) {
      return res.status(400).json({ message: 'User info missing from request' });
    }

    const currentUser = await User.findById(user._id)
      .populate('friendRequests', 'username email profilePicture');

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(currentUser.friendRequests);
  } catch (error) {
    console.error('❌ Error fetching friend requests:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const acceptGroupJoinRequest = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admin.equals(req.body.adminId)) {
      return res.status(403).json({ message: "Only group admins can accept requests" });
    }

    // Remove from pending and add to members if not already added
    group.pendingRequests = group.pendingRequests.filter(
      (id) => id.toString() !== userId
    );
    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }

    await group.save();
    res.status(200).json({ message: "User added to group" });
  } catch (err) {
    console.error("❌ Error accepting group join request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getGroupJoinRequests = async (req, res) => {
  try {
    const { user } = req.body;
    const adminId = user._id;

    const groups = await Group.find({ admin: adminId }).populate('pendingRequests', 'username');

    const joinRequests = [];

    for (let group of groups) {
      for (let requester of group.pendingRequests) {
        joinRequests.push({
          _id: requester._id,
          username: requester.username,
          groupId: group._id,
          groupName: group.groupName
        });
      }
    }

    res.status(200).json(joinRequests);
  } catch (err) {
    console.error('❌ Failed to get group requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getChatTargetDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Try to find as a user first
    const user = await User.findById(id).select('username profilePicture');
    if (user) return res.status(200).json({ type: 'user', data: user });

    // If not found as user, try to find as a group
    const group = await Group.findById(id).select('groupName avatar');
    if (group) return res.status(200).json({ type: 'group', data: group });

    // Neither user nor group found
    return res.status(404).json({ message: 'User or group not found' });
  } catch (err) {
    console.error('Error fetching chat target:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const chatInfo = async (req,res)=>{

 const { chatType, targetId } = req.params;

  try {
    if (chatType === 'friend') {
      const user = await User.findById(targetId).select('username profilePicture');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ type: 'friend', ...user.toObject() });
    }

    if (chatType === 'group') {
      const group = await Group.findById(targetId)
        .select('groupName avatar description')
        .populate('admin', 'username');
      if (!group) return res.status(404).json({ message: 'Group not found' });
      return res.status(200).json({ type: 'group', ...group.toObject() });
    }

    res.status(400).json({ message: 'Invalid chatType' });
  } catch (err) {
    console.error('❌ Error in /chat-info route:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

