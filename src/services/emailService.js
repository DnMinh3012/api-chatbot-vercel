require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email để gửi email
        pass: process.env.EMAIL_PASS  // Mật khẩu email hoặc mật khẩu ứng dụng
    }
});

// Hàm gửi email
const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent // Sử dụng thuộc tính html thay vì text
  };

  return transporter.sendMail(mailOptions);
};

let getBodyHTMLEmail = (dataSend) => {
    let result = `
    <h3>Xin Chào ${dataSend.name}!</h3>
    <p>BẠN NHẬN ĐƯỢC EMAIL NÀY VÌ ĐÃ ĐẶT BÀN THÀNH CÔNG TRÊN VMU RESTAURENT</p>
    <p>Dưới đây là thông tin của bạn.Vui lòng kiểm tra kĩ thông tin: </p>
    <div><b>Họ và tên:</b> ${dataSend.name}</div>
    <div><b>Số điện thoại:</b> ${dataSend.phoneNumber}</div>
    <div><b>Thời gian:</b> ${dataSend.timeOrder}</div>
    <div><b>Ghi chú:</b> ${dataSend.note}</div>
    <div><b>Số người:</b> ${dataSend.number_of_seats}</div>
    <div><b>Nhà hàng chúng tôi rất hân hạnh được phục vụ quý khách . Xin cảm ơn</b></div>`;
    return result;
  }

module.exports = {
    getBodyHTMLEmail:getBodyHTMLEmail,
    sendEmail:sendEmail,
}
