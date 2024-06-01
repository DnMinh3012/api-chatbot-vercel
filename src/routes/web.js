import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import chatBotService from "../services/chatBotService";
import userController from "../controllers/userController";
const { ReservationRequestModel } = require('../model/index');
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);
    router.get('/form-reserve-table/:senderId/:tableTpId', chatBotController.getReserveTable);
    router.get('/form-edit-table/:senderId/:reservationRequestId', chatBotController.getEditTable)
    // router.get("/form-feedback-table/:senderId", chatBotController.getFeedbackTable);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.post('/setup-persistent-menu', chatBotService.setupPersistentMenu);
    router.post('/reserve-table-ajax', chatBotController.handleReserveTableAjax)
    router.post('/edit-reserve-table-ajax', chatBotController.handleEditReserveTableAjax)
    // router.post('/feedback-table-ajax', chatBotController.handleFeedbackTableAjax)

    router.get('/api/get-users', userController.handleGetUsers);
    router.get('/api/get-dishes', userController.handleGetDishes);
    // router.get('/api/get-feedback', userController.handleGetFeedback);
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.delete('/api/complete-user', userController.handleCompleteUser)

    router.get("/test", async (req, res) => {
        let user = await chatBotService.getFacebookUsername(3350311028355090);
    });
    app.get('/get-reservation/:id', async (req, res) => {
        try {
            const reservationRequestId = req.params.id;
            const reservation = await ReservationRequestModel.findById(reservationRequestId);
            if (reservation) {
                res.json(reservation);
            } else {
                res.status(404).send('Reservation not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;