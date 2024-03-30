import request from "request";

require("dotenv").config();
const URL_SHOW_ROOM_GIF = "https://media3.giphy.com/media/TGcD6N8uzJ9FXuDV3a/giphy.gif?cid=ecf05e47afe5be971d1fe6c017ada8e15c29a76fc524ac20&rid=giphy.gif";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_MAIN_MENU = "https://bit.ly/49eBGAU"
const IMAGE_MAIN_MENU2 = "https://bit.ly/4aoMzBy"
const IMAGE_MAIN_MENU3 = "https://bit.ly/4aumRvg"
const IMAGE_MAIN_MENU4 = "https://bit.ly/3PEVSVH"

const IMAGE_FISH = "https://bit.ly/3x8sJMe";
const IMAGE_AP = "https://bit.ly/3IWplGV";
const IMAGE_CLASSIC = "https://bit.ly/3TvzRdc";

const IMAGE_DETAIL_AP = "https://bit.ly/3TEnOug";
const IMAGE_DETAIL_AP2 = "https://bit.ly/49ePag7";
const IMAGE_DETAIL_AP3 = "https://bit.ly/49n8hVC";

const IMAGE_DETAIL_FISH = "https://bit.ly/4ap8TuG";
const IMAGE_DETAIL_FISH2 = "https://bit.ly/4az5cCu";
const IMAGE_DETAIL_FISH3 = "https://bit.ly/3xftJhX";

const IMAGE_DETAIL_CLASSIC1 = "https://bit.ly/4asUs9v";
const IMAGE_DETAIL_CLASSIC2 = "https://bit.ly/3xdblpM";
const IMAGE_DETAIL_CLASSIC3 = "https://bit.ly/3PHK0CF";

const IMAGE_ROOMS1 = "https://bit.ly/3TXh8c7";
const IMAGE_ROOMS2 = "https://bit.ly/49fXMDd";
const IMAGE_ROOMS3 = "https://bit.ly/49lULBf";





let getFacebookUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
};

let handleGetStartedResponding = (username, sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response_first = { "text": `Xin chào ${username} đến Vimaru Restaurant` };
            let response_second = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Vimaru restaurant",
                                "subtitle": "Xin được phục vụ cho bạn những món ngon nhất",
                                "image_url": "https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "MENU",
                                        "payload": "MAIN_MENU",
                                    },
                                    {
                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Hướng dẫn sử dụng Bot",
                                        "payload": "GUIDE_BOT",
                                    }
                                ],
                            }]
                    }
                }
            };

            //send a welcome message
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response_first);

            //send a image with button view main menu
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response_second);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
};

let handleSendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Menu chính",
                                "subtitle": "Cửa hàng chúng tôi chủ yếu phục vụ 2 loại menu sau",
                                "image_url": IMAGE_MAIN_MENU,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Buổi trưa",
                                        "payload": "LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Buổi tối",
                                        "payload": "DINNER_MENU",
                                    },

                                ],
                            },

                            {
                                "title": "Giờ mở của",
                                "subtitle": "T2-T6 10AM - 11PM  | T7 5PM - 10PM | CN 5PM - 9PM",
                                "image_url": IMAGE_MAIN_MENU2,
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            },

                            {
                                "title": "Không gian nhà hàng",
                                "subtitle": "Nhà hàng có sức chứa lên đến 300 khách ngồi và tương tự tại các tiệc cocktail",
                                "image_url": IMAGE_MAIN_MENU3,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ROOMS",
                                    }
                                ],
                            }


                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

};

let handleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Tráng miện",
                                "subtitle": "Tráng miệng đa dạng",
                                "image_url": IMAGE_AP,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Salad",
                                "subtitle": "Salad cho người ăn chay",
                                "image_url": "https://bit.ly/imageSalad",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Các món cá",
                                "subtitle": "Cá 7 món",
                                "image_url": IMAGE_FISH,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "xem chi tiết",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Các món truyền thống",
                                "subtitle": "Các món ngon truyền thống ẩm thực Việt Nam",
                                "image_url": IMAGE_CLASSIC,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW CLASSICS",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            {
                                "title": "Quay lại MENU chính",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let handleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Tráng miện",
                                "subtitle": "Tráng miệng đa dạng",
                                "image_url": IMAGE_AP,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_APPETIZERS",
                                    }
                                ],
                            },

                            {
                                "title": "Salad",
                                "subtitle": "Salad cho người ăn chay",
                                "image_url": "https://bit.ly/imageSalad",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Các món cá",
                                "subtitle": "Cá 7 món",
                                "image_url": IMAGE_FISH,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "xem chi tiết",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Các món truyền thống",
                                "subtitle": "Các món ngon truyền thống ẩm thực Việt Nam",
                                "image_url": IMAGE_CLASSIC,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "SHOW CLASSICS",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            {
                                "title": "Quay lại MENU chính",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let handleBackToMainMenu = (sender_psid) => {
    handleSendMainMenu(sender_psid);
};

let handleBackToLunchMenu = (sender_psid) => {
    handleSendLunchMenu(sender_psid);
};

let handleReserveTable = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getFacebookUsername(sender_psid);
            let response = { text: `Hi ${username}, What time and date you would like to reserve a table ?` };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let handleShowRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Phòng gia đình",
                                "subtitle": "Phòng thích hợp cho tiệc tối đa 25 người",
                                "image_url": IMAGE_ROOMS1,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Phòng Họp",
                                "subtitle": "Phòng phù hợp cho tiệc tối đa 35 người",
                                "image_url": IMAGE_ROOMS2,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Phòng sự kiện",
                                "subtitle": "Phòng thích hợp cho tiệc tối đa 45 người",
                                "image_url": IMAGE_ROOMS3,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại Menu",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {

                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            //send a welcome message
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessageAskingQuality = (sender_id) => {
    let request_body = {
        "recipient": {
            "id": sender_id
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": "What is your party size ?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1-2",
                    "payload": "SMALL",
                }, {
                    "content_type": "text",
                    "title": "2-5",
                    "payload": "MEDIUM",
                },
                {
                    "content_type": "text",
                    "title": "more than 5",
                    "payload": "LARGE",
                }
            ]
        }
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
};

let sendMessageAskingPhoneNumber = (sender_id) => {
    let request_body = {
        "recipient": {
            "id": sender_id
        },
        "messaging_type": "RESPONSE",
        "message": {
            "text": "Thank you. And what's the best phone number for us to reach you at?",
            "quick_replies": [
                {
                    "content_type": "user_phone_number",
                }
            ]
        }
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
};

let sendMessageDoneReserveTable = async (sender_id) => {
    try {
        let response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://bit.ly/giftDonalTrump"
                }
            }
        };
        await sendTypingOn(sender_id);
        await sendMessage(sender_id, response);

        //get facebook username
        let username = await getFacebookUsername(sender_id);

        //send another message
        let response2 = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": `Done! \nOur reservation team will contact you as soon as possible ${username}.\n \nWould you like to check our Main Menu?`,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "SHOW MAIN MENU",
                            "payload": "MAIN_MENU"
                        },
                        {
                            "type": "phone_number",
                            "title": "☎ HOT LINE",
                            "payload": "+911911"
                        },
                        {
                            "type": "postback",
                            "title": "START OVER",
                            "payload": "RESTART_CONVERSATION"
                        }
                    ]
                }
            }
        };
        await sendTypingOn(sender_id);
        await sendMessage(sender_id, response2);
    } catch (e) {
        console.log(e);
    }
};

let sendNotificationToTelegram = (user) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                chat_id: process.env.TELEGRAM_GROUP_ID,
                parse_mode: "HTML",
                text: `
| --- <b>A new reservation</b> --- |
| ------------------------------------------------|
| 1. Username: <b>${user.name}</b>   |
| 2. Phone number: <b>${user.phoneNumber}</b> |
| 3. Time: <b>${user.time}</b> |
| 4. Quantity: <b>${user.quantity}</b> |
| 5. Created at: ${user.createdAt} |
| ------------------------------------------------ |                           
      `
            };

            // Send the HTTP request to the Telegram
            request({
                "uri": `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessageDefaultForTheBot = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Sorry, I'm just a bot, man ^^ \nYou can test me with all these buttons or try to make a reservation.\n\nThis video may help you to understand me 😉"
            };
            //send a media template
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "media",
                        "elements": [
                            {
                                "media_type": "video",
                                "url": "https://www.facebook.com/haryphamdev/videos/635394223852656/",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://bit.ly/subscribe-haryphamdev",
                                        "title": "Watch more!"
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Start over",
                                        "payload": "RESTART_CONVERSATION"
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let handleShowDetailRooms = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": URL_SHOW_ROOM_GIF
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Phòng thích hợp cho tiệc tối đa 45 người.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Xem Menu",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let handleDetailSalad = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": URL_SALAD_GIF
                    }
                }
            };
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Entree Salad \n$25.00`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "SHOW MAIN MENU",
                                "payload": "MAIN_MENU"
                            },
                            {

                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                "title": "Đặt bàn",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let handleDetailAppetizer = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_AP,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_AP2,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_AP3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Quay lại menu chính",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {

                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};
let handleDetailFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_FISH,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_FISH2,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_FISH3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Quay lại menu chính",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let handleDetailClassic = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_CLASSIC1,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_CLASSIC2,
                            },

                            {
                                "title": "Bánh kếp đậu đỏ",
                                "subtitle": "Giá - $20.00",
                                "image_url": IMAGE_DETAIL_CLASSIC3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_MAIN_MENU4,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Quay lại menu chính",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {

                                        "type": "web_url",
                                        "url": `${process.env.URL_WEB_VIEW_ORDER}?senderID=${sender_psid}`,
                                        "title": "Đặt bàn",
                                        "webview_height_ratio": "tall",
                                        "messenger_extensions": true
                                    }
                                ],
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
        } catch (e) {
            reject(e);
        }
    });
};

let sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response,
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v9.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(res)
                console.log(body)
                if (!err) {
                    console.log("message sent!");
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendTypingOn = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action": "typing_on"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let markMessageSeen = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action": "mark_seen"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Khởi động lại Bot",
                        "payload": "RESTART_BOT"
                    },
                    {
                        "type": "web_url",
                        "title": "Truy cập FanPage",
                        "url": "https://www.facebook.com/profile.php?id=61556806597524",
                        "webview_height_ratio": "full"
                    }
                ]
            }
        ]
    }
    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body);
        if (!err) {
            console.log('setup PersistentMenu succeeds!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return res.send("setup PersistentMenu succeeds")
}
module.exports = {
    getFacebookUsername: getFacebookUsername,
    handleGetStartedResponding: handleGetStartedResponding,
    handleSendMainMenu: handleSendMainMenu,
    handleSendLunchMenu: handleSendLunchMenu,
    handleSendDinnerMenu: handleSendDinnerMenu,
    handleDetailAppetizer: handleDetailAppetizer,
    handleBackToMainMenu: handleBackToMainMenu,
    handleBackToLunchMenu: handleBackToLunchMenu,
    handleReserveTable: handleReserveTable,
    handleShowRooms: handleShowRooms,
    sendMessageAskingQuality: sendMessageAskingQuality,
    sendMessageAskingPhoneNumber: sendMessageAskingPhoneNumber,
    sendMessageDoneReserveTable: sendMessageDoneReserveTable,
    sendNotificationToTelegram: sendNotificationToTelegram,
    sendMessageDefaultForTheBot: sendMessageDefaultForTheBot,
    handleShowDetailRooms: handleShowDetailRooms,
    handleDetailSalad: handleDetailSalad,
    handleDetailFish: handleDetailFish,
    handleDetailClassic: handleDetailClassic,
    markMessageSeen: markMessageSeen,
    sendTypingOn: sendTypingOn,
    sendMessage: sendMessage,
    setupPersistentMenu: setupPersistentMenu
};