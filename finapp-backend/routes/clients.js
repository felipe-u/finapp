const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/test", clientsController.createClient);

router.get("/clients/:clientId", clientsController.getClient);

router.get("/clients/:clientId/financing", clientsController.getClientFinancing);

router.get("/clients/:clientId/personalInfo", clientsController.getClientPersonalInfo);

router.get("/clients/:clientId/geoInfo", clientsController.getClientGeoInfo);

router.get("/clients/:clientId/commercialInfo", clientsController.getClientCommercialInfo);

router.get("/clients/:clientId/name", clientsController.getClientName);

router.get("/debtors-list", clientsController.getDebtorsList);

router.get("/debtors-list/:searchTerm", clientsController.getDebtorsListBySearchTerm);

router.get("/debtors-list/statuses/:status", clientsController.getDebtorsListByStatuses);

module.exports = router;
