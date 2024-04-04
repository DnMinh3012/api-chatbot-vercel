import { raw } from "body-parser";
import db from "../models";
require('dotenv').config();
import _ from 'lodash'
// import emailServices from './emailServices'
import { v4 as uuidv4 } from "uuid";
import e from "express";


let postBookAppointment = (data) => {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.senderId || !data.date
                || !data.fullName) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                })
            } else {
                // let token = uuidv4();
                // await emailServices.senSimpleEmail({
                //     reciverEmail: data.email,
                //     patienName: data.fullName,
                //     time: data.timeString,
                //     doctorName: data.doctorName,
                //     redirectLink: buildUrlEmaill(data.doctorId, token)
                // })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        firstName: data.username,
                        address: data.address,
                        phone: data.phoneNumber
                    },
                });
                console.log("check user", user[0])

                if (!user) user = {};
                if (user && user[0]) {
                    await db.services.findOrCreate({
                        where: { customerid: data.id },
                        defaults: {
                            statusID: 'S1',
                            customerid: data.customerid,
                            date: data.reserveDate,
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