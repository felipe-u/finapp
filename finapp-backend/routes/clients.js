const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/create-client", clientsController.createClient);

router.post("/user-info", clientsController.showUserInfo);

module.exports = router;
