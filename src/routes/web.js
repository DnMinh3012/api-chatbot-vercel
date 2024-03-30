import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import chatBotService from "../services/chatBotService";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);
    router.get("/form-reserve-table/:sender_psid'", chatBotController.getReserveTable);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.post('/setup-persistent-menu', chatBotService.setupPersistentMenu);
    router.post('/reserve-table-ajax', chatBotController.handleReserveTableAjax)
    router.get("/test", async (req, res) => {
        let user = await chatBotService.getFacebookUsername(3350311028355090);
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;