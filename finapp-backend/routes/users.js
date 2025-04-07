const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

router.get("/users", usersController.getUser);

router.get("/users/all", usersController.getAllUsers);

router.put("/user-update", usersController.updateUser);

router.post("/check-password", usersController.checkPassword);

router.post("/change-password", usersController.changePassword);

router.post("/change-lang", usersController.changeLang);

module.exports = router;