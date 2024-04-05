import { raw } from "body-parser";
require('dotenv').config();
import _ from 'lodash'
// import emailServices from './emailServices'
import { v4 as uuidv4 } from "uuid";
import e from "express";
import { User, Booking, History } from "../model/model"
const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.reserveDate) {
                console.log("Missing required parameters");
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                });
            } else {
                // Tạo một người dùng mới
                const newUser = new User({
                    email: data.email,
                    role: "R3",
                    username: data.username,
                    address: data.address,
                    phoneNumber: data.phoneNumber
                });

                // Lưu ID của người dùng mới
                const userId = newUser._id;

                // Tạo một đặt bàn mới
                const newBooking = new Booking({
                    date: data.reserveDate,
                    user: userId,
                    currentNumber: data.currentNumber,
                    status: 's1'
                });

                // Tìm lịch sử đặt bàn của người dùng
                let userBookingHistory = await History.findOne({ user: userId });

                if (userBookingHistory) {
                    // Nếu có lịch sử đặt bàn của người dùng, tăng số lượng lên 1
                    userBookingHistory.number += 1;
                } else {
                    // Nếu không có lịch sử đặt bàn của người dùng, tạo mới và đặt số lượng là 1
                    userBookingHistory = new History({
                        user: userId,
                        booking: newBooking._id,
                        number: 1
                    });
                }

                // Lưu thông tin người dùng và đặt bàn mới vào cơ sở dữ liệu
                await newUser.save();
                await newBooking.save();
                await userBookingHistory.save();

                console.log("check user", newUser);
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

let getUsers = (userId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (userId === "ALL") {
                const users = await User.find({ role: 'R3' }).select('-password');
                console.log(users); // Log ra danh sách users
                const bookings = await Booking.find({ user: { $in: users.map(user => user._id) } });
                // Sử dụng $in để tìm các booking có user nằm trong danh sách users tìm được
                const data = users.map(user => {
                    const userBooking = bookings.find(booking => booking.user.equals(user._id));
                    return {
                        email: user.email,
                        username: user.username,
                        phoneNumber: user.phoneNumber,
                        date: userBooking.date,
                        currentNumber: userBooking ? userBooking.currentNumber : null,
                        status: userBooking ? userBooking.status : null,
                    };
                });
                resolve(data);
            }
            if (userId && userId !== "ALL") {
                const user = await User.findOne({ _id: userId }).select('-password');
                resolve(user);
            }
        } catch (e) {
            reject(e);
        }
    });

}
module.exports = {
    postBookAppointment: postBookAppointment,
    getUsers: getUsers
};
