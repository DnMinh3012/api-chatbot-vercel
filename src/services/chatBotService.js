import request from "request";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_SHOW_ROOM_GIF = "https://media3.giphy.com/media/TGcD6N8uzJ9FXuDV3a/giphy.gif?cid=ecf05e47afe5be971d1fe6c017ada8e15c29a76fc524ac20&rid=giphy.gif";

const IMAGE_MAIN_MENU_1 = "https://bit.ly/3PEVSVH"
const IMAGE_MAIN_MENU_2 = "https://bit.ly/4aoMzBy"
const IMAGE_MAIN_MENU_3 = "https://bit.ly/4aumRvg"

const IMAGE_SALAD = "https://bit.ly/3TRKYyq";
const APPETIZERS_IMAGE = "https://bit.ly/3IWplGV";
const FISH_IMAGE = "https://bit.ly/3x8sJMe";
const SHOW_CLASSICS_IMAGE = "https://bit.ly/3TvzRdc";

const IMAGE_BACK_MAIN_MENU = "https://bit.ly/3PEVSVH"

const IMAGE_DETAIL_APPERTIZER1 = "https://bit.ly/3TEnOug";
const IMAGE_DETAIL_APPERTIZER2 = "https://bit.ly/49ePag7";
const IMAGE_DETAIL_APPERTIZER3 = "https://bit.ly/49n8hVC";

const IMAGE_DETAIL_FISH1 = "https://bit.ly/3TEWI66";
const IMAGE_DETAIL_FISH2 = "https://bitly.is/4a2WpsR";
const IMAGE_DETAIL_FISH3 = "https://bit.ly/3TAgBLF";

const IMAGE_DETAIL_CLASSIC1 = "https://bit.ly/3TANV5k";
const IMAGE_DETAIL_CLASSIC2 = "https://bit.ly/3VG3CdZ";
const IMAGE_DETAIL_CLASSIC3 = "https://bit.ly/3PDpPp6";




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

let getStartedResponse = (username, sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response_first = { "text": `xin chào ${username} đến nhà hàng của chúng tôi` };
            let response_second = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Vimaru restaurant",
                                "image_url": "https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem Menu",
                                        "payload": "MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt Bàn ",
                                        "payload": "RESERVE_TABLE",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Hướng dẫn sử dụng",
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

let sendMainMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "MENU của Vimaru Restaurant",
                                "subtitle": "Chúng tôi hân hạnh mang đến cho bạn những món ăn phong phú",
                                "image_url": IMAGE_MAIN_MENU_1,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Bữa trưa",
                                        "payload": "LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Bữa tối",
                                        "payload": "DINNER_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "PUB MENU",
                                        "payload": "PUB_MENU",
                                    }
                                ],
                            },

                            {
                                "title": "Giờ mở cửa",
                                "subtitle": "T2-T6 10AM - 11PM  | T7 5PM - 10PM | CN 5PM - 9PM",
                                "image_url": IMAGE_MAIN_MENU_2,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
                                    }
                                ],
                            },

                            {
                                "title": "Không gian nhà hàng",
                                "subtitle": "Nhà hàng có sức chứa lên đến 300 khách ngồi và tương tự tại các tiệc cocktail",
                                "image_url": IMAGE_MAIN_MENU_3,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Chi tiết",
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

let HandleSendLunchMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Món tráng miệng",
                                "subtitle": "Nhà hàng có rất nhiều món tráng miệng hấp dẫn",
                                "image_url": APPETIZERS_IMAGE,
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
                                "image_url": IMAGE_SALAD,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_ENTREE_SALAD",
                                    }
                                ],
                            },

                            {
                                "title": "Cá 7 món",
                                "subtitle": "Cá chép om dưa",
                                "image_url": FISH_IMAGE,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_FISH",
                                    }
                                ],
                            },

                            {
                                "title": "Các món truyền thống",
                                "subtitle": "Các món ăn Việt Nam truyền thống ",
                                "image_url": SHOW_CLASSICS_IMAGE,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem chi tiết",
                                        "payload": "SHOW_CLASSICS",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_BACK_MAIN_MENU,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại MENU chính",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
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

let HandleSendDinnerMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Lump crab cocktail\n$25.00"
            };
            let response2 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://djfoodie.com/wp-content/uploads/Crab-Cocktail-3-800.jpg"
                    }
                }
            };

            let response3 = {
                "text": "House cured salmon\n$16.00"
            };
            let response4 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://www.thespruceeats.com/thmb/rys3IyH2DB6Ma_r4IQ6emN-2jYw=/4494x3000/filters:fill(auto,1)/simple-homemade-gravlax-recipe-2216618_hero-01-592dadcba64743f98aa1f7a14f81d5b4.jpg"
                    }
                }
            };

            let response5 = {
                "text": "Steamed Whole Maine Lobsters\n$35.00"
            };
            let response6 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://portcitydaily.com/wp-content/uploads/For-the-Shell-of-It.jpg"
                    }
                }
            };

            let response7 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại menu chính hoặc đặt bàn?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt bàn",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);

            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendPubMenu = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "text": "Hamburger with French Fries\n$19.50"
            };
            let response2 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://previews.123rf.com/images/genmike/genmike1411/genmike141100010/33951440-burger-and-french-fries.jpg"
                    }
                }
            };

            let response3 = {
                "text": "Ham and Cheese on a Baguette as Salad or Sandwich\n$21.00"
            };
            let response4 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://s3-ap-southeast-1.amazonaws.com/v3-live.image.oddle.me/product/Blackforesthamcheesebfd18d.jpg"
                    }
                }
            };

            let response5 = {
                "text": "Braised short rib salad\n$29.50"
            };
            let response6 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/ribs_0.jpg?itok=bOf0t_NF"
                    }
                }
            };

            let response7 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Quay lại menu chính hoặc đặt bàn?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt bàn",
                                "payload": "RESERVE_TABLE",
                            }
                        ]
                    }
                }
            };

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response1);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response2);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response3);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response4);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response5);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response6);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response7);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};


let handleBackToMainMenu = (sender_psid) => {
    sendMainMenu(sender_psid);
};

let handleBackToLunchMenu = (sender_psid) => {
    HandleSendLunchMenu(sender_psid);
};

let handleReserveTable = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getFacebookUsername(sender_psid);
            let response = { text: `Hi ${username},Thời gian và ngày bạn muốn đặt bàn ?` };
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
                                "title": "Bull Moose Room",
                                "subtitle": "The room is suited for parties of up to 25 people",
                                "image_url": "https://bit.ly/showRoom1",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem MÔ TẢ",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Lillie Langstry Room",
                                "subtitle": "The room is suited for parties of up to 35 people",
                                "image_url": "https://bit.ly/showRoom2",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem MÔ TẢ",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Lincoln Room",
                                "subtitle": "The room is suited for parties of up to 45 people",
                                "image_url": "https://bit.ly/showRoom3",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Xem MÔ TẢ",
                                        "payload": "SHOW_ROOM_DETAIL",
                                    }
                                ],
                            },

                            {
                                "title": "Go back",
                                "image_url": " https://bit.ly/imageToSend",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Quay lại MENU chính",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
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
        "uri": "https://graph.facebook.com/v9.0/me/messages",
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
        "uri": "https://graph.facebook.com/v9.0/me/messages",
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
                            "title": "MENU",
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

let showRoomDetail = (sender_psid) => {
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
                        "text": `The rooms is suited for parties up to 45 people.`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt bàn",
                                "payload": "RESERVE_TABLE",
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

let handleViewDetailAppetizer = (sender_psid) => {
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
                                "subtitle": "Món tráng miệng không thể thiếu trong mỗi nhà hàng Trung Hoa - 1$",
                                "image_url": IMAGE_DETAIL_APPERTIZER1,
                            },

                            {
                                "title": "Xôi Xoài",
                                "subtitle": "Là món tráng miệng đến từ Đài Loan, với lớp vỏ bơ kết hợp với mứt dứa rất dễ làm bạn gây nghiện - 1$",
                                "image_url": IMAGE_DETAIL_APPERTIZER2,
                            },

                            {
                                "title": "Bingsu",
                                "subtitle": "Món Bingsu ngon bắt mắt sẽ là món tráng miệng tuyệt vời trong mùa hè - 1$",
                                "image_url": IMAGE_DETAIL_APPERTIZER3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_BACK_MAIN_MENU,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi trưa",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi tối",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
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

let handleViewDetailSalad = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": IMAGE_SALAD
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
                                "title": "MENU",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Đặt bàn",
                                "payload": "RESERVE_TABLE",
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
let handleViewDetailFish = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "cá song hấp xì dầu",
                                "subtitle": "300k",
                                "image_url": IMAGE_DETAIL_FISH1,
                            },

                            {
                                "title": "lẩu cá tầm",
                                "subtitle": "200k",
                                "image_url": IMAGE_DETAIL_FISH2,
                            },

                            {
                                "title": " cá ngạnh xào nấm",
                                "subtitle": "100k",
                                "image_url": IMAGE_DETAIL_FISH3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_BACK_MAIN_MENU,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi trưa",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi tối",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
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

let handleViewDetailClassic = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Heo sữa quay lu",
                                "subtitle": "300k",
                                "image_url": IMAGE_DETAIL_CLASSIC1,
                            },

                            {
                                "title": "Chả giò",
                                "subtitle": "200k",
                                "image_url": IMAGE_DETAIL_CLASSIC2,
                            },

                            {
                                "title": "Nem cua bể",
                                "subtitle": "100k",
                                "image_url": IMAGE_DETAIL_CLASSIC3,
                            },

                            {
                                "title": "Go back",
                                "image_url": IMAGE_BACK_MAIN_MENU,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi trưa",
                                        "payload": "BACK_TO_LUNCH_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Menu buổi tối",
                                        "payload": "BACK_TO_MAIN_MENU",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt bàn",
                                        "payload": "RESERVE_TABLE",
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
                "uri": "https://graph.facebook.com/v9.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    console.log("senTypingOn sent!")
                } else {
                    reject("Unable to send senTypingOn:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let markReadMessage = (sender_psid) => {
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
                "uri": "https://graph.facebook.com/v9.0/me/messages",
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

module.exports = {
    getFacebookUsername: getFacebookUsername,
    getStartedResponse: getStartedResponse,
    sendMainMenu: sendMainMenu,
    HandleSendLunchMenu: HandleSendLunchMenu,
    HandleSendDinnerMenu: HandleSendDinnerMenu,
    sendPubMenu: sendPubMenu,
    handleViewDetailAppetizer: handleViewDetailAppetizer,
    handleBackToMainMenu: handleBackToMainMenu,
    handleBackToLunchMenu: handleBackToLunchMenu,
    handleReserveTable: handleReserveTable,
    handleShowRooms: handleShowRooms,
    sendMessageAskingQuality: sendMessageAskingQuality,
    sendMessageAskingPhoneNumber: sendMessageAskingPhoneNumber,
    sendMessageDoneReserveTable: sendMessageDoneReserveTable,
    sendNotificationToTelegram: sendNotificationToTelegram,
    sendMessageDefaultForTheBot: sendMessageDefaultForTheBot,
    showRoomDetail: showRoomDetail,
    handleViewDetailSalad: handleViewDetailSalad,
    handleViewDetailFish: handleViewDetailFish,
    handleViewDetailClassic: handleViewDetailClassic,
    markReadMessage: markReadMessage,
    sendTypingOn: sendTypingOn,
    sendMessage: sendMessage
};