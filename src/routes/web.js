import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import chatBotService from "../services/chatBotService";
import userController from "../controllers/userController";
import { where } from "sequelize";
const { ReservationRequestModel, CustomerModel, TableModel } = require('../model/index');
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);
    router.get('/form-reserve-table/:senderId/:tableTpId', chatBotController.getReserveTable);
    router.get('/form-edit-table/:senderId/:reservationRequestId', chatBotController.getEditTable)
    router.get('/form-delete-table/:senderId/:reservationRequestId', chatBotController.getDeleteReserveTable);
    router.get('/form-feedback-table/:senderId/:reservationRequestId', chatBotController.getFeedbackTable)
    router.post('/set-completed/:id', chatBotController.setCompleted)
    router.post('/set-approved/$id', chatBotController.setapproved)

    // router.get("/form-feedback-table/:senderId", chatBotController.getFeedbackTable);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.post('/setup-persistent-menu', chatBotService.setupPersistentMenu);
    router.post('/reserve-table-ajax', chatBotController.handleReserveTableAjax)
    router.post('/edit-reserve-table-ajax', chatBotController.handleEditReserveTableAjax)
    router.post('/delete-reserve-table-ajax', chatBotController.handleDeletetReserveTableAjax)

    router.post('/feedback-table-ajax', chatBotController.handleFeedbackTableAjax)

    router.get('/api/get-users', userController.handleGetUsers);
    router.get('/api/get-dishes', userController.handleGetDishes);
    // router.get('/api/get-feedback', userController.handleGetFeedback);
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.delete('/api/complete-user', userController.handleCompleteUser)

    router.get("/test", async (req, res) => {
        let user = await chatBotService.getFacebookUsername(3350311028355090);
    });
    // app.get('/get-reservation/:reservationRequestId', async (req, res) => {
    //     try {
    //         const reservationRequestId = req.params.reservationRequestId;
    //         const reservation = await ReservationRequestModel.findOne({ where: { id: reservationRequestId } });
    //         const table = await TableModel.findOne({ where: { id: reservationRequestId.tableId } });

    //         let customer = await ReservationRequestModel.findOne({ where: { id: reservationRequestId.customerId } });
    //         let data = {
    //             email: customer.email, 
    //             phoneNumber: customer.phoneNumber,
    //             currentNumber: customer.numberOfSeats,
    //             timeOrder: reservation.timeOrder
    //         }
    //         console.log("dataWeb:", data);
    //         if (reservation) {
    //             res.json(data);
    //         } else {
    //             res.status(404).send('Reservation not found');
    //         }
    //     } catch (error) {
    //         res.status(500).send(error.message);
    //     }
    // });

    return app.use("/", router);
};

module.exports = initWebRoutes;