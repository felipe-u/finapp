const express = require("express");
const virtualDateController = require("../controllers/virtualDate");

const router = express.Router();

router.get("/virtual-date/get", virtualDateController.getCurrentDate);

router.post("/virtual-date/advance", virtualDateController.advanceDate);

router.post("/virtual-date/reset", virtualDateController.resetDate);

module.exports = router;
