const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/test", clientsController.createClient);

// router.get("/clients", clientsController.getClients);

router.get("/debtors-list", clientsController.getDebtorsList);

router.get("/debtors-list/:searchTerm", clientsController.getDebtorsListBySearchTerm);

router.get("/debtors-list/statuses/:status", clientsController.getDebtorsListByStatuses);

module.exports = router;
