const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/test", clientsController.createClient);

// router.get("/clients", clientsController.getClients);

router.get("/debtors-list", clientsController.getDebtorsList);

router.get("/debtors-list/:searchTerm", clientsController.getDebtorsListBySearchTerm);

module.exports = router;
