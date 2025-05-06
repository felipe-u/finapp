const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.get(ROUTES.USER.GET_USER, usersController.getUser);

router.get(ROUTES.USER.GET_ALL_USERS, usersController.getAllUsers);

router.put(ROUTES.USER.UPD_USER, usersController.updateUser);

router.post(ROUTES.USER.CHECK_PASS, usersController.checkPassword);

router.post(ROUTES.USER.CHANGE_PASS, usersController.changePassword);

router.post(ROUTES.USER.CHANGE_LANG, usersController.changeLang);

module.exports = router;