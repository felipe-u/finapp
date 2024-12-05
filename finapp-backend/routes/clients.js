const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/test", clientsController.createClient);

// router.get("/clients", clientsController.getClients);

router.get("/debtors-list", clientsController.getDebtorsList);

router.get("/clients/:clientId", clientsController.findClientById);

router.get("/clients/:clientName", clientsController.findClientByName);

module.exports = router;
