const express = require("express");
const upload = require("../middleware/upload");
const imagesController = require("../controllers/images");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.post(ROUTES.IMAGES.UPLOAD, upload.single("image"), imagesController.uploadImage);

router.put(ROUTES.IMAGES.UPD_CLIENT_PH, upload.single("image"), imagesController.updateClientPhoto);

router.put(ROUTES.IMAGES.UPD_USER_PH, upload.single("image"), imagesController.updateUserPhoto);

router.delete(ROUTES.IMAGES.DELETE, imagesController.deleteImage);

router.post(ROUTES.IMAGES.DELETE_MULT, imagesController.deleteImages)

module.exports = router;
