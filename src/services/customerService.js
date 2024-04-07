import { raw } from "body-parser";
require('dotenv').config();
import _ from 'lodash'
// import emailServices from './emailServices'
import { v4 as uuidv4 } from "uuid";
import e from "express";
import { User, Booking, History } from "../model/model"
import emailServices from './emailServices'


let buildUrlEmaill = (customerId, token) => {
    let result = `${process.env.URL_WEB}/verify-booking?token=${token}&doctorId=${customerId}`
    return result
}
const postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.reserveDate) {
                console.log("Missing required parameters");
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                });
            } else {
                let newUser = await User.findOne({ phoneNumber: data.phoneNumber });
                if (newUser && newUser._id) {
                    let checkBooking = await Booking.findOne({ user: newUser._id });
                    if (checkBooking && checkBooking._id) {
                        await History.updateOne(
                            { user: newUser._id },
                            { $inc: { number: 1 } }
                        );
                    }
                    console.log("check newBooking", newBooking);
                    resolve({
                        errCode: 0,
                        user: newUser
                    });
                } else {
                    newUser = new User({
                        email: data.email,
                        role: "R3",
                        username: data.username,
                        address: data.address,
                        phoneNumber: data.phoneNumber
                    });

                    await newUser.save();
                }
                let newBooking = new Booking({
                    date: data.reserveDate,
                    user: newUser._id,
                    currentNumber: data.currentNumber,
                    status: 's1'
                });
                let userBookingHistory = new History({
                    user: newUser._id,
                    booking: newBooking._id,
                    number: 1
                });
                await newBooking.save();
                await userBookingHistory.save();
                await emailServices.senSimpleEmail({
                    reciverEmail: data.email,
                    patienName: data.username,
                    time: data.reserveDate,
                    doctorName: data.username,
                    redirectLink:
                        (data.newUser._id, token)
                })
                resolve({
                    errCode: 0,
                    user: newUser
                });
            }
        } catch (error) {
            console.error("Error in postBookAppointment:", error);
            reject(error);
        }
    });
};


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
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    date: booking.date,
                    currentNumber: booking.currentNumber,
                    status: booking.status,
                };
            });

            // Chờ tất cả các promise hoàn thành và thêm kết quả vào mảng data
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

module.exports = {
    postBookAppointment: postBookAppointment,
    getUsers: getUsers
};
