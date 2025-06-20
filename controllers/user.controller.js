import express from "express";
import User from "../models/user.model.js";
import cloudinary from "../cloudinary/cloudinary.config.js";
import fs from "fs";

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
