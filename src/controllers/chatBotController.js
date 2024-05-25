require("dotenv").config();
import request from "request";
import moment from "moment";
import chatBotService from "../services/chatBotService";
import homepageService from "../services/homepageService";
import customerService from "../services/customerService"
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let user = {
    name: "",
    phoneNumber: "",
    time: "",
    quantity: "",
    createdAt: ""
};
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
// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
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
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
    clearTimeout(timeouts[sender_psid]);

    // Set a new timeout to send a follow-up message after 10 seconds if no response
    timeouts[sender_psid] = setTimeout(() => {
        let response1 = {
            "text": "Xin cảm ơn bạn đã tin tưởng nhà hàng chúng tôi,Tôi có thể giúp bạn gì nữa không!"
        };
        callSendAPI(sender_psid, response1);
    }, 10000); // 10 seconds in milliseconds
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
            user.name = username;
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
    return res.render('reserve-table.ejs', {
        senderId: senderId,
        tableTpId: tableTpId
    });
}
// let getFeedbackTable = (req, res) => {
//     let senderId = req.params.senderId;
//     return res.render('feedback-table.ejs', {
//         senderId: senderId
//     });
// }

let handleReserveTableAjax = async (req, res) => {
    try {
        let username = await chatBotService.getFacebookUsername(req.body.psid);
        let data = {
            psid: req.body.psid,
            name: username,
            email: req.body.email,
            phone: req.body.phoneNumber,
            timeOrder: req.body.reserveDate,
            tableTpId: req.body.tableTpId,
            note: req.body.note,
            number_of_seats: req.body.currentNumber,
        }
        await customerService.postBookAppointment(data);
        await chatBotService.writeDataToGoogleSheet(data);

        let response1 = {
            "text": `Thong tin khach dat ban
            \nHo va ten: ${username}
            \nEmail: ${req.body.email}
            \nSo Dien Thoai: ${req.body.phoneNumber}
            \nSố người: ${req.body.currentNumber},
            \nNgày đặt bàn: ${req.body.reserveDate},
            \nGhi chú: ${req.body.note}
            `
        }
        await chatBotService.sendMessage(req.body.psid, response1)
        return res.status(200).json({
            message: 'ok',
            psid: req.body.psid,
        })
    } catch (e) {
        console.log("Loi Reserve table: ", e);
        return res.status(500).json({
            message: e
        })
    }
}
// let handleFeedbackTableAjax = async (req, res) => {
//     try {
//         let username = await chatBotService.getFacebookUsername(req.body.psid);
//         let data = {
//             psid: req.body.psid,
//             username: username,
//             email: req.body.email,
//             phoneNumber: req.body.phoneNumber,
//             reserveDate: req.body.reserveDate,
//             feedback: req.body.feedback
//         }
//         console.log("check data", data)
//         await customerService.feedbackAppointment(data);
//         let response1 = {
//             "text": `Cảm ơn bạn đã để lại phản hồi xin gửi tặng bạn voucher giảm giá cho lần đặt bàn lần sau: MINHDEPTRAI`
//         }
//         await chatBotService.sendMessage(req.body.psid, response1)
//         return res.status(200).json({
//             message: 'ok',
//             data: data
//         })
//     } catch (e) {
//         console.log("Loi Reserve table: ", e);
//         return res.status(500).json({
//             message: e
//         })
//     }
// }
module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    getReserveTable: getReserveTable,
    handleReserveTableAjax: handleReserveTableAjax,
    // getFeedbackTable: getFeedbackTable,
    // handleFeedbackTableAjax, handleFeedbackTableAjax
};
