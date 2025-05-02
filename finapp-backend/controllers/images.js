const PersonalInfo = require("../models/personalInfo");
const { User } = require("../models/user");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const imageUrl = req.file.path;
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
    const { imageUrl } = req.query;

    if (!imageUrl) {
      return res.status(400).json({ message: "No image URL provided" });
    }
    const publicId = extractPublicId(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Delete result: ", result);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete image",
      error: err.message,
    });
  }
};

exports.deleteImages = async (req, res, next) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "No valid image URLs provided" });
    }

    let errors = [];

    for (const imageUrl of images) {
      const publicId = extractPublicId(imageUrl);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        errors.push(`Failed to delete ${imageUrl}`);
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

function extractPublicId(url) {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return `images/${filename.split(".")[0]}`;
}
