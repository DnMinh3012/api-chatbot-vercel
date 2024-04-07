require('dotenv').config();
import { reject } from 'lodash';
import nodemailer from 'nodemailer'
let senSimpleEmail = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: '"Do Nhat Minh" <minh88216@st.vimaru.edu.vn>', // sender address
                to: dataSend.reciverEmail, // list of receivers
                subject: "Thông Tin Lịch Khám bệnh",
                html: getBodyHTMLEmail(dataSend)
            });
            resolve(true)

        } catch (e) {
            reject(e)
        }
    })
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin Chào ${dataSend.patienName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian ${dataSend.time}</b></div>
        <div><b>Bác sĩ ${dataSend.doctorName}</b></div>
        <p>Vui lòng click vào đường link dưới đây để xác nhận thủ tục đặt lịch khám bệnh</p>
        <div><a href=  ${dataSend.redirectLink} target = "_blank" >Click here </a></div>
        <div><b>Xin cảm ơn</b></div>
        `;
    }
    else {
        result = `
        <h3>Hello ${dataSend.patienName}!</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare</p>
        <p>Information to book a medical appointment</p>
        <div><b>Time ${dataSend.time}</b></div>
        <div><b>Doctor ${dataSend.doctorName}</b></div>
        <p>Please click on the link below to confirm the procedure for making an appointment</p>
        <div><a href=  ${dataSend.redirectLink} target = "_blank" >Click here </a></div>
        <div><b>Thank you</b></div>
        `;
    }
    return result;
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin Chào ${dataSend.firstName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare</p>
        <p>Thông tin Hoá đơn được gửi trong file đính kèm</p>
        <div><b>Xin cảm ơn</b></div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.firstName}!</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare</p>
        <p>Invoice information sent in attachment</p>
        <div><b>Thank you</b></div>
        `
    }
    return result;
}
let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: '"Do Nhat Minh" <minh88216@st.vimaru.edu.vn>', // sender address
                to: dataSend.email,
                subject: "Hoá Đơn Khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientid}-${new Date().getTime}.png`,
                        content: dataSend.imgBase64.split("base64")[1],
                        encoding: `base64`
                    }
                ]
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    senSimpleEmail: senSimpleEmail,
    sendAttachment: sendAttachment
}



