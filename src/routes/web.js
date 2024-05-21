import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import chatBotService from "../services/chatBotService";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);
    router.get("/form-reserve-table/:senderId", chatBotController.getReserveTable);
    // router.get("/form-feedback-table/:senderId", chatBotController.getFeedbackTable);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.post('/setup-persistent-menu', chatBotService.setupPersistentMenu);
    router.post('/reserve-table-ajax', chatBotController.handleReserveTableAjax)
    // router.post('/feedback-table-ajax', chatBotController.handleFeedbackTableAjax)

    router.get('/api/get-users', userController.handleGetUsers);
    router.get('/api/get-dishes', userController.handleGetDishes);
    // router.get('/api/get-feedback', userController.handleGetFeedback);
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.delete('/api/complete-user', userController.handleCompleteUser)

    router.get("/test", async (req, res) => {
        let user = await chatBotService.getFacebookUsername(3350311028355090);
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;