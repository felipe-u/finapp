const PersonalInfo = require("../models/personalInfo");
const { User } = require("../models/user");
const fs = require("fs");
const path = require("path");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl: imageUrl });
  } catch (err) {
    res.status(500).json({
      message: "Error uploading image",
      error: err.message,
    });
  }
};

exports.updateClientPhoto = async (req, res, next) => {
  try {
    const { modelId, imageUrl } = req.body;
    const personalInfo = await PersonalInfo.findById(modelId);
    if (!personalInfo) {
      return res.status(404).json({ message: "Personal Info not found" });
    }
    personalInfo.photo = imageUrl;
    await personalInfo.save();
    console.log("Photo updated");
    res.status(200).json({ message: "Photo updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateUserPhoto = async (req, res, next) => {
  try {
    const { modelId, imageUrl } = req.body;
    const user = await User.findById(modelId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.photo = imageUrl;
    await user.save();
    console.log("Photo updated");
    res.status(200).json({ message: "Photo updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const imageUrl = req.query.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ message: "No image URL provided" });
    }
    const imageName = path.basename(imageUrl);
    const imagePath = path.join(__dirname, "..", "uploads", imageName);

    await fs.promises.access(imagePath, fs.constants.F_OK);
    await fs.promises.unlink(imagePath);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).json({
        message: "Image not found",
        error: err.message,
      });
    }
    res.status(500).json({
      message: "Failed to delete image",
      error: err.message,
    });
  }
};

exports.deleteImages = async (req, res, next) => {
  try {
    const imageUrls = req.body.images;
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "No valid image URLs provided" });
    }
    let errors = [];

    for (const imageUrl of imageUrls) {
      const imageName = path.basename(imageUrl);
      const imagePath = path.join(__dirname, "..", "uploads", imageName);

      try {
        await fs.promises.access(imagePath, fs.constants.F_OK);
        await fs.promises.unlink(imagePath);
      } catch (err) {
        if (err.code === "ENOENT") {
          errors.push(`Image not found: ${imageUrl}`);
        } else {
          errors.push(`Failed to delete: ${imageUrl}`);
        }
      }
    }
    if (errors.length > 0) {
      return res.status(500).json({
        message: "Some images could not be deleted",
        errors,
      });
    }
    res.status(200).json({ message: "Images deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
