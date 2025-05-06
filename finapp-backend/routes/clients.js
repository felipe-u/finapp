const express = require("express");
const clientsController = require("../controllers/clients");
const router = express.Router();
const ROUTES = require("../utils/routesPaths");

router.get(ROUTES.CLIENTS.GET_CLIENT, clientsController.getClient);

router.get(ROUTES.CLIENTS.GET_CLIENT_FIN, clientsController.getClientFinancing);

router.get(ROUTES.CLIENTS.GET_CLIENT_PER, clientsController.getClientPersonalInfo);

router.post(ROUTES.CLIENTS.EDIT_CLIENT_PER, clientsController.editClientPersonalInfo);

router.get(ROUTES.CLIENTS.GET_CLIENT_GEO, clientsController.getClientGeoInfo);

router.post(ROUTES.CLIENTS.EDIT_CLIENT_GEO, clientsController.editClientGeoInfo);

router.get(ROUTES.CLIENTS.GET_CLIENT_COM, clientsController.getClientCommercialInfo);

router.post(ROUTES.CLIENTS.EDIT_CLIENT_COM, clientsController.editClientCommercialInfo);

router.get(ROUTES.CLIENTS.GET_CLIENT_NAME, clientsController.getClientName);

router.get(ROUTES.CLIENTS.GET_DEBTORS_BY_MAN, clientsController.getDebtorsListByManager);

router.get(ROUTES.CLIENTS.GET_ALL_DEBTORS, clientsController.getAllDebtors);

router.post(ROUTES.CLIENTS.ASS_DEBTOR, clientsController.assigndDebtorToManager)

router.post(ROUTES.CLIENTS.REM_DEBTOR, clientsController.removeDebtorFromManager);

router.get(ROUTES.CLIENTS.GET_DEBTORS_WITHOUT_ASS, clientsController.getDebtorsListWithoutAssignment);

router.get(ROUTES.CLIENTS.GET_DEBTORS_REP, clientsController.getDebtorsForReport);

module.exports = router;
