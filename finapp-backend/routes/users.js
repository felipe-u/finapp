const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

router.get("/users", usersController.getUser);

router.get("/users/all", usersController.getAllUsers);

router.post("/create-user", usersController.createUser);

router.put("/user-update", usersController.updateUser);

module.exports = router;