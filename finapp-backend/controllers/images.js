const PersonalInfo = require("../models/personalInfo");
const fs = require("fs");
const path = require("path");

exports.uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imageUrl });
};

exports.updateClientPhoto = (req, res, next) => {
  const { personalInfoId, imageUrl } = req.body;
  PersonalInfo.findById(personalInfoId).then((personalInfo) => {
    if (!personalInfo) {
      return res.status(404).json({ message: "Personal Info not found" });
    }
    personalInfo.photo = imageUrl;
    personalInfo
      .save()
      .then(() => {
        console.log("Photo updated");
        return res.status(200).json({ message: "Photo updated successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

exports.deleteImage = (req, res, next) => {
  const imageUrl = req.query.imageUrl;
  if (!imageUrl) {
    return res.status(400).json({ message: "No image URL provided" });
  }

  const imageName = path.basename(imageUrl);
  const imagePath = path.join(__dirname, "..", "uploads", imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Image not found" });
    }
  });

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
};

exports.deleteImages = (req, res, next) => {
  const imageUrls = req.body.images;

  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return res.status(400).json({ message: "No valid image URLs provided" });
  }

  let errors = [];

  imageUrls.forEach((imageUrl) => {
    const imageName = path.basename(imageUrl);
    const imagePath = path.join(__dirname, "..", "uploads", imageName);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        errors.push(`Image not found: ${imageUrl}`);
      } else {
        fs.unlink(imagePath, (err) => {
          if (err) {
            error.push(`Failed to delete: ${imageUrl}`);
          }
        });
      }
    });
  });

  if (errors.length > 0) {
    return res
      .status(500)
      .json({ message: "Some images could not be deleted", errors });
  }

  res.status(200).json({ message: "Images deleted successfully" });
};
