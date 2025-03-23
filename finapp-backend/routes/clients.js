const express = require("express");

const router = express.Router();

const clientsController = require("../controllers/clients");

router.post("/test", clientsController.createClient);

router.get("/clients/:clientId", clientsController.getClient);

router.get("/clients/:clientId/financing", clientsController.getClientFinancing);

router.get("/clients/:clientId/personalInfo", clientsController.getClientPersonalInfo);

router.post("/clients/:clientId/personalInfo/edit", clientsController.editClientPersonalInfo);

router.get("/clients/:clientId/geoInfo", clientsController.getClientGeoInfo);

router.post("/clients/:clientId/geoInfo/edit", clientsController.editClientGeoInfo);

router.get("/clients/:clientId/commercialInfo", clientsController.getClientCommercialInfo);

router.post("/clients/:clientId/commercialInfo/edit", clientsController.editClientCommercialInfo);

router.get("/clients/:clientId/name", clientsController.getClientName);

router.get("/debtors-list/:managerId", clientsController.getDebtorsListByManager);

router.get("/all-debtors", clientsController.getAllDebtors);

router.post("/assign-debtor", clientsController.assigndDebtorToManager)

router.post("/remove-debtor", clientsController.removeDebtorFromManager);

router.get("/debtors-list-no-assignment", clientsController.getDebtorsListWithoutAssignment);

router.get("/debtors-list-report", clientsController.getDebtorsForReport);

module.exports = router;
