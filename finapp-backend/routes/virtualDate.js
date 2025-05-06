const express = require("express");
const virtualDateController = require("../controllers/virtualDate");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.get(ROUTES.VIRTUAL_DATE.GET_CURRENT, virtualDateController.getCurrentDate);

router.post(ROUTES.VIRTUAL_DATE.ADVANCE, virtualDateController.advanceDate);

router.post(ROUTES.VIRTUAL_DATE.RESET, virtualDateController.resetDate);

module.exports = router;
