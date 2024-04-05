import { raw } from "body-parser";
require('dotenv').config();
import _ from 'lodash'
// import emailServices from './emailServices'
import { v4 as uuidv4 } from "uuid";
import e from "express";
import { User, Booking } from "../model/model"
let postBookAppointment = (data) => {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.senderId || !data.reserveDate) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                })
                console.log("Missing required parameters")
            } else {
                // let token = uuidv4();
                // await emailServices.senSimpleEmail({
                //     reciverEmail: data.email,
                //     patienName: data.fullName,
                //     time: data.timeString,
                //     doctorName: data.doctorName,
                //     redirectLink: buildUrlEmaill(data.doctorId, token)
                // })
                let newUser = await User.findOne({ phoneNumber: data.phoneNumber }, { maxTimeMS: 60000 });

                if (!newUser) {

                    let newUser = new User({
                        email: data.email,
                        role: "R3",
                        username: data.username,
                        address: data.address,
                        phoneNumber: data.phoneNumber
                    })
                    let newBooking = new Booking({
                        date: data.reserveDate,
                        user: newUser._id,
                        currentNumber: data.currentNumber,
                        status: 's1'
                    })
                    await newUser.save();
                    await newBooking.save();
                } else {
                    resolve({
                        message: "useasd"
                    })
                }
                console.log("check user", newUser);
                resolve({
                    errCode: 0,
                    user: newUser
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
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
