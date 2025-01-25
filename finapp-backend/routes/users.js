const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

router.get("/users", usersController.getAllUsers);

router.post("/create-user", usersController.createUser);

module.exports = router;