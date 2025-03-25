const express = require("express");
const upload = require("../middleware/upload");
const imagesController = require("../controllers/images");

const router = express.Router();

router.post("/upload", upload.single("image"), imagesController.uploadImage);

router.put("/imgs/clients", upload.single("image"), imagesController.updateClientPhoto);

router.delete("/delete-image", imagesController.deleteImage);

module.exports = router;
