import { raw } from "body-parser";
require('dotenv').config();
import _ from 'lodash'
// import emailServices from './emailServices'
import { v4 as uuidv4 } from "uuid";
import e from "express";
import { User, Allcode, Booking } from "../model/model"
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
                    const allcodeR3 = await Allcode.findOne({ type: 'R3' }, { maxTimeMS: 60000 });
                    const allcodeS1 = await Allcode.findOne({ type: 'S1' }, { maxTimeMS: 60000 });
                    let newUser = new User({
                        email: data.email,
                        roleId: allcodeR3._id,
                        username: data.username,
                        address: data.address,
                        phoneNumber: data.phoneNumber
                    })
                    let newBooking = new Booking({
                        date: data.reserveDate,
                        user: newUser._id,
                        allcode: allcodeS1._id
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
module.exports = {
    postBookAppointment: postBookAppointment
};
