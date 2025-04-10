const multer = require("multer");
const path = require("path");

const filename = (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: filename,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
module.exports._fileFilter = fileFilter;
module.exports._filename = filename;
