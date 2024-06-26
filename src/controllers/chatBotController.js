require("dotenv").config();
import request from "request";
import moment from "moment";
import chatBotService from "../services/chatBotService";
import homepageService from "../services/homepageService";
import customerService from "../services/customerService";
import emailService from "../services/emailService";
import { CustomerModel, ReservationRequestModel, TableModel, TableTypeModel, FeedbackModel } from "../model/index";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const ADMIN_PSID = process.env.ADMIN_PSID;
const WIT_TOKEN = process.env.WIT_TOKEN;

const { Wit, log } = require('node-wit');
const witClient = new Wit({
    accessToken: WIT_TOKEN,
    logger: new log.Logger(log.DEBUG)
});


let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};
let timeouts = {};

async function handleMessage(sender_psid, received_message) {
    let response;
    try {
        console.log("received_message", received_message);

        if (!witClient || !witClient.message) {
            throw new Error('witClient is not properly defined.');
        }

        if (received_message && received_message.text) {
            const witResponse = await witClient.message(received_message.text, {});
            console.log('Wit.ai response:', JSON.stringify(witResponse));

            // Adjusted the way to capture intent
            const intent = witResponse.intents && witResponse.intents[0] && witResponse.intents[0].name;

            switch (intent) {
                case 'Make_Reservation':
                    response = { "text": "Bạn muốn đặt bàn. Xin chọn loại bàn bạn muốn đặt." };
                    chatBotService.handleShowRooms(sender_psid);
                    break;
                case 'Menu_Info':
                    chatBotService.handleSendMainMenu(sender_psid);
                    return; // Exit the function after sending the main menu
                case 'Check_Reservation':
                    const tableIdEntity = witResponse.entities['table_id:table_id'] && witResponse.entities['table_id:table_id'][0];
                    if (tableIdEntity) {
                        const RtableId = tableIdEntity.value;
                        let customer = await chatBotService.CheckReservation(sender_psid, RtableId);
                        console.log("customer AI", customer);
                        response = customer.response;
                    } else {
                        response = { "text": "Xin vui lòng cung cấp mã đặt bàn của bạn theo cú pháp 'Thông tin bàn đặt + Mã đặt bàn'." };
                    }
                    break;
                case 'Change_Reservation':
                    const changeTableIdEntity = witResponse.entities['table_id:table_id'] && witResponse.entities['table_id:table_id'][0];
                    if (changeTableIdEntity) {
                        const RtableId = changeTableIdEntity.value;
                        let customer = await chatBotService.ChangeReservation(sender_psid, RtableId);
                        console.log("customer AI", customer);
                        response = customer.response;
                    } else {
                        response = { "text": "Xin vui lòng cung cấp mã đặt bàn của bạn theo cú pháp 'Thay đổi thông tin bàn đặt + Mã đặt bàn'." };
                    }
                    break;
                case 'Cancel_Reservation':
                    const CancelTableIdEntity = witResponse.entities['table_id:table_id'] && witResponse.entities['table_id:table_id'][0];
                    if (CancelTableIdEntity) {
                        const RtableId = CancelTableIdEntity.value;
                        let customer = await chatBotService.CancelReservation(sender_psid, RtableId);
                        console.log("customer AI", customer);
                        response = customer.response;
                    } else {
                        response = { "text": "Xin vui lòng cung cấp mã đặt bàn của bạn theo cú pháp 'Huỷ đặt bàn + Mã đặt bàn'." };
                    }
                    break;
                default:
                    response = { "text": "Xin lỗi, tôi không hiểu yêu cầu của bạn." };
            }
        } else if (received_message && received_message.attachments) {
            const attachment_url = received_message.attachments[0].payload.url;
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Is this the right picture?",
                            "subtitle": "Tap a button to answer.",
                            "image_url": attachment_url,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "No!",
                                    "payload": "no",
                                }
                            ],
                        }]
                    }
                }
            };
        } else {
            console.error('Received message is undefined or missing message property');
            response = { "text": "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn." };
        }
    } catch (error) {
        console.error('Error handling message:', error);
        response = { "text": "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn." };
    }

    // Call the send API to send the response back to the user
    callSendAPI(sender_psid, response);

    // Clear old timeout and set up a new timeout
    clearTimeout(timeouts[sender_psid]);
    timeouts[sender_psid] = setTimeout(() => {
        const response1 = {
            "text": "Xin cảm ơn bạn đã tin tưởng nhà hàng chúng tôi. Tôi có thể giúp bạn gì nữa không!"
        };
        callSendAPI(sender_psid, response1);
    }, 10000);
}



// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    clearTimeout(timeouts[sender_psid]);
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload

    await chatBotService.markMessageSeen(sender_psid);
    switch (payload) {
        case "GET_STARTED":
        case "RESTART_BOT":
        case "RE_STARTED":
            //get facebook username
            let username = await chatBotService.getFacebookUsername(sender_psid);
            //send welcome response to users

            await chatBotService.handleGetStartedResponding(username, sender_psid);
            break;
        case "MAIN_MENU":
            //send main menu to users
            await chatBotService.handleSendMainMenu(sender_psid);
            break;
        case "GUIDE_BOT":
            await homepageService.handleSendGuideToUseBot(sender_psid);
            break;
        case "LUNCH_MENU":
            await chatBotService.handleSendLunchMenu(sender_psid);
            break;
        case "DINNER_MENU":
            await chatBotService.handleSendDinnerMenu(sender_psid);
            break;
        case "SHOW_ROOMS":
            await chatBotService.handleShowRooms(sender_psid);
            break;
        case "SHOW_ROOM_DETAIL":
            await chatBotService.handleShowDetailRooms(sender_psid);
            break;
        case "SHOW_APPETIZERS":
            await chatBotService.handleDetailAppetizer(sender_psid);
            break;

        case "SHOW_ENTREE_SALAD":
            await chatBotService.handleDetailSalad(sender_psid);
            break;
        case "SHOW_FISH":
            await chatBotService.handleDetailFish(sender_psid);
            break;
        case "SHOW_CLASSICS":
            await chatBotService.handleDetailClassic(sender_psid);
            break;

        case "BACK_TO_MAIN_MENU":
            await chatBotService.handleBackToMainMenu(sender_psid);
            break;
        case "BACK_TO_LUNCH_MENU":
            await chatBotService.handleBackToLunchMenu(sender_psid);
            break;

        case "yes":
            response = { text: "Thank you!" };
            callSendAPI(sender_psid, response);
            break;
        case "no":
            response = { text: "Please try another image." };
            callSendAPI(sender_psid, response);
            break;
        default:
            console.log("Something wrong with switch case payload");
    }
    if (payload.includes('SHOW_MENU_')) {
        let menuId = payload.split('_')[2];
        await chatBotService.handleSendMenuDetail(sender_psid, menuId);
    }
    if (payload.includes('SHOW_TABLE_TYPES_')) {
        let tableTypeId = payload.split('_')[3];
        await chatBotService.handleShowDetailRooms(sender_psid, tableTypeId);
    }
    // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
    // chatBotService.timeOutChatbot(sender_psid);
};

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
let getReserveTable = (req, res) => {
    let senderId = req.params.senderId;
    let TypeId = req.params.tableTpId;
    return res.render('reserve-table.ejs', {
        senderId: req.params.senderId,
        tableTpId: TypeId
    });
    console.log("table Type:", TypeId)
}
let getEditTable = async (req, res) => {
    let senderId = req.params.senderId;
    let reservationRequestId = req.params.reservationRequestId;
    let reservation = await ReservationRequestModel.findOne({ where: { id: reservationRequestId } });
    let table = await TableModel.findOne({ where: { id: reservation.tableId } });
    let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
    return res.render('edit-table.ejs', {
        senderId: senderId,
        reservationRequestId: reservationRequestId,
        email: customer.email,
        phone: customer.phone,
        currentNumber: customer.numberOfSeats,
        timeOrder: reservation.timeOrder,
        numberOfSeats: table.numberOfSeats
    });
    console.log("m Type:", {
        data: data,
        reservationRequestId: reservationRequestId,
    })
}
let getFeedbackTable = async (req, res) => {
    let senderId = req.params.senderId;
    let reservationRequestId = req.params.reservationRequestId;
    let reservation = await ReservationRequestModel.findOne({ where: { id: reservationRequestId } });
    let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });

    return res.render('feedback-table.ejs', {
        senderId: senderId,
        reservationRequestId: reservationRequestId,
        email: customer.email,
        phone: customer.phone,
    });
    console.log("m Type:", {
        data: data,
        reservationRequestId: reservationRequestId,
    })
}

let getDeleteReserveTable = async (req, res) => {
    let senderId = req.params.senderId;
    let reservationRequestId = req.params.reservationRequestId;
    let reservation = await ReservationRequestModel.findOne({ where: { id: reservationRequestId } });
    let table = await TableModel.findOne({ where: { id: reservation.tableId } });
    let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
    return res.render('delete-table.ejs', {
        senderId: senderId,
        reservationRequestId: reservationRequestId,
        email: customer.email,
        phone: customer.phone,
        currentNumber: customer.numberOfSeats,
        timeOrder: reservation.timeOrder,
        numberOfSeats: table.numberOfSeats
    });
    console.log("table Type:", reservationRequestId)
}

let getAppovedReserveTable = async (req, res) => {
    let senderId = req.params.senderId;
    let reservationRequestId = req.params.reservationRequestId;
    let reservation = await ReservationRequestModel.findOne({ where: { id: reservationRequestId } });
    let table = await TableModel.findOne({ where: { id: reservation.tableId } });
    let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
    return res.render('approved.ejs', {
        senderId: senderId,
        reservationRequestId: reservationRequestId,
        email: customer.email,
        phone: customer.phone,
        currentNumber: customer.numberOfSeats,
        timeOrder: reservation.timeOrder,
        numberOfSeats: table.numberOfSeats
    });
    console.log("table Type:", reservationRequestId)
}

// let getFeedbackTable = (req, res) => {
//     let senderId = req.params.senderId;
//     return res.render('feedback-table.ejs', {
//         senderId: senderId
//     });
// }

    let handleReserveTableAjax = async (req, res) => {
        try {
            console.log("Request Body:", req.body); // Kiểm tra dữ liệu đầu vào
            let username = await chatBotService.getFacebookUsername(req.body.psid);
            let data = {
                psid: req.body.psid,
                name: username,
                email: req.body.email,
                phone: req.body.phoneNumber,
                timeOrder: req.body.reserveDate,
                TypeId: req.body.tableTpId,
                note: req.body.note,
                number_of_seats: req.body.currentNumber,
            };

            const bookingResult = await customerService.postBookAppointment(data);

            if (bookingResult.errCode !== 0) {
                throw new Error(bookingResult.message);
            }

            let reservationRequest = bookingResult.data;
            await chatBotService.adminSendReservationRequest(ADMIN_PSID, data, reservationRequest)
            console.log("reservationRequest::", reservationRequest)
            let response2 = {
                "text": `Cảm ơn bạn đã tin tưởng nhà hàng chúng tôi:
            \nThời gian đặt bàn của bạn là: ${reservationRequest.timeOrder}`
            }
            let response3 = {
                "text": `NẾU QUÝ KHÁCH CÓ MUỐN THAY ĐỔI ĐẶT BÀN VUI LÒNG HỦY TRƯỚC 2 TIẾNG`
            }
            let response = {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: `Thay Đổi giờ đặt bàn của bạn`,
                                buttons: [
                                    {
                                        type: "web_url",
                                        url: `${process.env.URL_WEB_VIEW_DELETE}/${req.body.psid}/${reservationRequest.id}`,
                                        title: "Huỷ đặt bàn",
                                        webview_height_ratio: "tall",
                                        messenger_extensions: true
                                    },
                                    {
                                        type: "web_url",
                                        url: `${process.env.URL_WEB_VIEW_EDIT}/${req.body.psid}/${reservationRequest.id}`,
                                        title: "Thay đổi Thời Gian đặt bàn",
                                        webview_height_ratio: "tall",
                                        messenger_extensions: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
            await chatBotService.sendTypingOn(req.body.psid);
            await chatBotService.sendMessage(req.body.psid, response2);
            await chatBotService.sendMessage(req.body.psid, response);
            await chatBotService.sendMessage(req.body.psid, response3);

            let dataSend = {
                name: username,
                phoneNumber: req.body.phoneNumber,
                timeOrder: req.body.reserveDate,
                note: req.body.note,
                number_of_seats: req.body.currentNumber,
            };
            const emailHtml = emailService.getBodyHTMLEmail(dataSend);
            console.log("Email HTML content:", emailHtml); // Log nội dung email HTML
            // Gửi email thông báo cho người quản lý
            let customerEmail = req.body.email; // Email của khách hàng
            const emailSubject = 'Thông báo đặt bàn mới';
            await emailService.sendEmail(customerEmail, emailSubject, emailHtml);
            console.log("Email sent successfully"); // Log sau khi gửi email

            return res.status(200).json({
                message: 'ok',
                psid: req.body.psid,
                TypeId: req.body.tableTpId,
            });
        } catch (e) {
            console.error("Lỗi đặt bàn: ", e);
            return res.status(500).json({
                message: e.toString()
            });
        }
    }

let handleEditReserveTableAjax = async (req, res) => {
    try {
        let username = await chatBotService.getFacebookUsername(req.body.psid);
        let data = {
            psid: req.body.psid,
            name: username,
            email: req.body.email,
            phone: req.body.phone,
            timeOrder: req.body.reserveDate,
            reservationRequestId: req.body.reservationRequestId,
            note: req.body.note,
            number_of_seats: req.body.currentNumber,
        }
        console.log("check data", data)
        await customerService.EditAppointment(data);
        let response1 = {
            "text": `Cảm ơn bạn Chúng tôi đã thay đổi lại giờ đặt bàn của bạn: ${data.timeOrder} `
        }
        await chatBotService.sendMessage(req.body.psid, response1)
        return res.status(200).json({
            message: 'ok',
            data: data
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}
let handleDeletetReserveTableAjax = async (req, res) => {
    try {
        let username = await chatBotService.getFacebookUsername(req.body.psid);
        let data = {
            psid: req.body.psid,
            reservationRequestId: req.body.reservationRequestId,
            username: username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            note: req.body.note,

        }
        console.log("check data", data)
        await customerService.DeleteAppointment(data);
        let response1 = {
            "text": `Rất tiếc vì bạn đã huỷ đặt bàn, mong có thể tiếp tục phục vụ bạn ${username} lần sau`
        }
        await chatBotService.sendMessage(req.body.psid, response1)
        return res.status(200).json({
            message: 'ok',
            data: data
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}

let setCompleted = async (req, res) => {
    try {
        let Rid = req.params.id;
        let reservation = await ReservationRequestModel.findOne({ where: { id: Rid } });
        let table = await TableModel.findOne({ where: { id: reservation.tableId } });
        table.status = "available"
        table.save();
        let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
        console.log("Rid:", {
            "rid": Rid,
            "customerId": customer.id,
            "psid": customer.sender_id
        })
        let response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Vimaru restaurant",
                            "subtitle": "Xin cảm ơn bạn đã tin tưởng nhà hàng chúng tôi, xin hãy để lại đánh giá để bọn tôi có thể phục vụ bạn tốt hơn trong lần sau",
                            "image_url": "https://bit.ly/imageToSend",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": `${process.env.URL_WEB_VIEW_FEEDBACK}/${customer.sender_id}/${Rid}`,
                                    "title": "Đánh giá",
                                    "webview_height_ratio": "tall",
                                    "messenger_extensions": true
                                },
                            ],
                        }]
                }
            }
        };
        await chatBotService.sendMessage(customer.sender_id, response)
        return res.status(200).json({
            message: "ok",
            psid: customer,
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}
let setapproved = async (req, res) => {
    try {
        let Rid = req.params.id;
        if (!Rid) Rid = req.body.psid;
        let reservation = await ReservationRequestModel.findOne({ where: { id: Rid } });
        let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
        console.log("Rid:", {
            "rid": Rid,
            "customerId": customer.id,
            "psid": customer.sender_id
        })
        let response1 = {
            "text": "Cảm ơn! yêu cầu đặt bàn của bạn đã được xác nhận"
        };

        await chatBotService.sendMessage(customer.sender_id, response1)
        return res.status(200).json({
            message: "ok",
            psid: customer,
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}

let handleFeedbackTableAjax = async (req, res) => {
    try {
        let username = await chatBotService.getFacebookUsername(req.body.psid);
        let data = {
            psid: req.body.psid,
            reservationRequestId: req.body.reservationRequestId,
            username: username,
            email: req.body.email,
            phone: req.body.phone,
            timeOrder: req.body.reserveDate,
            feedback: req.body.note
        }
        console.log("check data", data)
        let response1 = {
            "text": `Cảm ơn bạn đã để lại phản hồi xin gửi tặng bạn voucher giảm giá cho lần đặt bàn lần sau: MINHDEPTRAI`
        }
        await chatBotService.sendMessage(req.body.psid, response1)
        await customerService.feedbackAppointment(data);
        return res.status(200).json({
            message: 'ok',
            data: data
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}

let setArrived = async (req, res) => {
    try {
        let Rid = req.params.id;
        if (!Rid) Rid = req.body.psid;
        let reservation = await ReservationRequestModel.findOne({ where: { id: Rid } });
        let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
        console.log("Rid:", {
            "rid": Rid,
            "customerId": customer.id,
            "psid": customer.sender_id
        })
        let response1 = {
            "text": "Tôi đã nhận thông báo bạn đã đến cửa hàng, Cảm ơn bạn đã tin tưởng nhà hàng chúng tôi"
        };

        await chatBotService.sendMessage(customer.sender_id, response1)
        return res.status(200).json({
            message: "ok",
            psid: customer,
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}

let setNotArrived = async (req, res) => {
    try {
        let Rid = req.params.id;
        if (!Rid) Rid = req.body.psid;
        let reservation = await ReservationRequestModel.findOne({ where: { id: Rid } });
        let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
        console.log("Rid:", {
            "rid": Rid,
            "customerId": customer.id,
            "psid": customer.sender_id
        })
        let response1 = {
            "text": "Tôi đã nhận thông báo bạn không đến cửa hàng, Bạn có thể cho tôi biết nguyên do không?"
        };
        let response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: `Nguyên do bạn không tới nhà hàng`,
                            buttons: [
                                {
                                    type: "web_url",
                                    url: `${process.env.URL_WEB_VIEW_DELETE}/${customer.sender_id}/${Rid}`,
                                    title: "Huỷ đặt bàn",
                                    webview_height_ratio: "tall",
                                    messenger_extensions: true
                                },
                            ]
                        }
                    ]
                }
            }
        };

        await chatBotService.sendMessage(customer.sender_id, response1)
        await chatBotService.sendMessage(customer.sender_id, response)
        
        return res.status(200).json({
            message: "ok",
            psid: customer,
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}
module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    getReserveTable: getReserveTable,
    getEditTable: getEditTable,
    getDeleteReserveTable: getDeleteReserveTable,
    handleReserveTableAjax: handleReserveTableAjax,
    handleEditReserveTableAjax: handleEditReserveTableAjax,
    handleDeletetReserveTableAjax: handleDeletetReserveTableAjax,
    setCompleted: setCompleted,
    getAppovedReserveTable: getAppovedReserveTable,
    getFeedbackTable: getFeedbackTable,
    setapproved: setapproved,
    handleFeedbackTableAjax: handleFeedbackTableAjax,
    setArrived: setArrived,
    setNotArrived: setNotArrived
};
