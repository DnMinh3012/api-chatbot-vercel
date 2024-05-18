import { raw } from "body-parser";
import db from "../models";
require('dotenv').config();
import _ from 'lodash'
import { v4 as uuidv4 } from "uuid";
import e from "express";

let buildUrlEmaill = (token) => {
    let result = `${process.env.URL_WEB}/verify-booking?token=${token}`
    return result
}
let postBookAppointment = (data) => {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.phone || !data.date
                || !data.fullName) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                })
            } else {
                let token = uuidv4();
                // await emailServices.senSimpleEmail({
                //     reciverEmail: data.email,
                //     patienName: data.fullName,
                //     time: data.timeString,
                //     doctorName: data.doctorName,
                //     redirectLink: 
                //     (data.doctorId, token)
                // })

                let user = await db.Customer.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        name: data.name,
                        phone: data.phoneNumber
                    },
                });
                console.log("check user", user)

                if (!user) user = {};
                if (user && user) {
                    await db.ReservationRequest.findOrCreate({
                        where: { patientid: Customer.id },
                        defaults: {
                            statusID: 'S1',
                            customer_id: Customer.id,
                            timestamps: Customer.timestamps,
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    user: user
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = postBookAppointment;

const getUsers = async (userId) => {
    try {
        let data = [];

        if (userId === "ALL") {
            const bookings = await Booking.find();

            // Lặp qua mỗi booking và lấy thông tin user tương ứng
            const userPromises = bookings.map(async (booking) => {
                const user = await User.findOne({ _id: booking.user }).select('-password');

                return {
                    id: booking._id,
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    date: booking.date,
                    currentNumber: booking.currentNumber,
                    status: booking.status,
                };
            });
            const userData = await Promise.all(userPromises);
            data = userData.reverse(); // Đảo ngược thứ tự của mảng kết quả
        } else if (userId) {
            const user = await User.findOne({ _id: userId }).select('-password');
            if (!user) {
                return null;
            }

            const bookings = await Booking.find({ user: userId });

            const userData = {
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                bookings: bookings.map((booking) => ({
                    date: booking.date,
                    currentNumber: booking.currentNumber,
                    status: booking.status,
                })),
            };

            data.push(userData);
        }

        return data;
    } catch (error) {
        throw error;
    }
};
const deleteUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Booking.findOne({ _id: userID });
            if (user) {
                await Booking.deleteOne({ _id: userID });
                resolve({
                    errCode: 0,
                    message: 'Delete Success!'
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'User is not exist!'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const CompleteUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Booking.findOne({ _id: userID });
            if (user) {
                let psid = user.psid;
                console.log("psid:", psid)
                await Booking.updateOne({ _id: userID }, { status: "S3" });
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
                                            "url": `${process.env.URL_WEB_VIEW_FEEDBACK}/${psid}`,
                                            "title": "Đánh giá",
                                            "webview_height_ratio": "tall",
                                            "messenger_extensions": true
                                        },
                                        {
                                            "type": "web_url",
                                            "url": `${process.env.URL_WEB_VIEW_ORDER}/${psid}`,
                                            "title": "Đặt bàn",
                                            "webview_height_ratio": "tall",
                                            "messenger_extensions": true
                                        }
                                    ],
                                }]
                        }
                    }
                };
                await chatBotService.sendMessage(psid, response)
                resolve({
                    errCode: 0,
                    message: 'Complete Success!'
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'User is not exist!'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
const feedbackAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.phoneNumber) {
                console.log("Missing required parameters");
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                });
            } else {
                const user = await User.findOne({ phoneNumber: data.phoneNumber });
                const newFeedback = new Feedback({
                    user: user._id,
                    feedback: data.feedback
                });

                await newFeedback.save();
                resolve({
                    errCode: 0,
                    feedback: newFeedback
                });
            }
        } catch (error) {
            console.error("Error in feedbackAppointment:", error);
            reject(error);
        }
    });
};

let getAllFeedback = async (id) => {
    try {
        let data = [];

        if (id === "ALL") {
            const feedback = await Feedback.find();

            // Lặp qua mỗi booking và lấy thông tin user tương ứng
            const userPromises = feedback.map(async (feedback) => {
                const user = await User.findOne({ _id: feedback.user }).select('-password');

                return {
                    id: feedback._id,
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    feedback: feedback.feedback,
                };
            });
            const userData = await Promise.all(userPromises);
            data = userData.reverse(); // Đảo ngược thứ tự của mảng kết quả
        } else if (userId) {
            const user = await User.findOne({ _id: userId }).select('-password');
            if (!user) {
                return null;
            }

            const feedback = await Feedback.find({ user: userId });

            const userData = {
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                feedback: feedback.map((feedback) => ({
                    feedback: feedback.feedback,
                })),
            };

            data.push(userData);
        }

        return data;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    getUsers: getUsers,
    deleteUser: deleteUser,
    CompleteUser: CompleteUser,
    feedbackAppointment: feedbackAppointment,
    getAllFeedback: getAllFeedback
};
