const express = require("express");
const upload = require("../middleware/upload");
const imagesController = require("../controllers/images");

const router = express.Router();

router.post("/upload", upload.single("image"), imagesController.uploadImage);

router.put("/imgs/personal-info", upload.single("image"), imagesController.updateClientPhoto);

router.put("/imgs/user", upload.single("image"), imagesController.updateUserPhoto);

router.delete("/delete-image", imagesController.deleteImage);

router.post("/delete-images", imagesController.deleteImages)

module.exports = router;
