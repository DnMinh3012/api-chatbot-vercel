const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleid: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Allcode"
        }
    ],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services"
    }]
});

const allcodeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true
    },
    valueEn: {
        type: String,
        required: true
    },
    valueVi: {
        type: String,
        required: true
    },
});
const servicesSchema = new mongoose.Schema({
    tableid: {
        type: String,
        required: true
    },
    date: {
        type: Date, // Sử dụng kiểu dữ liệu Date
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    allcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allcode"
    }
})
const User = mongoose.model("User", userSchema);
const Allcode = mongoose.model("Allcode", allcodeSchema);
const Services = mongoose.model("Services", servicesSchema);

module.exports = { User, Allcode, Services };
