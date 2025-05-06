const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.post(ROUTES.AUTH.REGISTER, authController.register);

router.post(ROUTES.AUTH.LOGIN, authController.login);

module.exports = router;