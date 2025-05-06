const express = require("express");
const emailController = require("../controllers/email");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.post(ROUTES.EMAIL.SEND, emailController.sendEmail);

module.exports = router;
