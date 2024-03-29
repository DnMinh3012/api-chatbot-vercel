import homepageService from "../services/homepageService";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomepage = (req, res) => {
    let fbPageId = process.env.PAGE_ID;
    return res.render("homepage.ejs", {
        fbPageId
    });
};

let getFacebookUserProfile = (req, res) => {
    return res.render("profile.ejs");
};

let setUpUserFacebookProfile = async (req, res) => {
    // Send the HTTP request to the Messenger Platform
    try {
        await homepageService.setUpMessengerPlatform(PAGE_ACCESS_TOKEN);
        return res.status(200).json({
            message: "OK"
        });
    } catch (e) {
        return res.status(500).json({
            "message": "Error from the node server"
        })
    }
};
let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "Xem Fanpage",
                        "url": "https://www.facebook.com/profile.php?id=61556806597524",
                        "webview_height_ratio": "full"
                    },

                    {
                        "type": "postback",
                        "title": "Khởi động lại BOT",
                        "payload": "RESTART_BOT"
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
            console.log('setup presistent menu succeeds!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
    return res.send("setup presistent menu succeeds")
}
module.exports = {
    getHomepage: getHomepage,
    getFacebookUserProfile: getFacebookUserProfile,
    setUpUserFacebookProfile: setUpUserFacebookProfile
};