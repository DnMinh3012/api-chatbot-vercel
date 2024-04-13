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
    },
    role: {
        type: String,
    },
    booking: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ]
});
const bookingSchema = new mongoose.Schema({
    tableid: {
        type: String,
    },
    date: {
        type: Date,
    },
    currentNumber: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    histories: [{  // Sử dụng mảng để liên kết với nhiều lịch sử
        type: mongoose.Schema.Types.ObjectId,
        ref: "History"
    }],
    status: {
        type: String,
    },
    psid: {
        type: String,
    }
});

const historySchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    number: {
        type: Number,
    },
});
const feedbackSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    feedback: {
        type: String
    },
});
const tableSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    tableName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String
    },
    status: {
        type: String
    },
    bookingNumber: {
        type: String
    },
    maxNumber: {
        type: String
    },
});

const menuSchema = new mongoose.Schema({
    menuName: {
        type: String
    },
    description: {
        type: String
    },
    menutype: {
        type: String
    },
});

const dishSchema = new mongoose.Schema({
    dishName: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },
    price: {
        type: String
    },
});
const specialSchema = new mongoose.Schema({
    nameSpecial: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    toDate: {
        type: Date
    },
});




const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const History = mongoose.model("History", historySchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);
const Table = mongoose.model("Table", tableSchema);
const Menu = mongoose.model("Menu", menuSchema);
const Dish = mongoose.model("Dish", dishSchema);
const Special = mongoose.model("Special", specialSchema);


module.exports = { User, Booking, History, Feedback };
