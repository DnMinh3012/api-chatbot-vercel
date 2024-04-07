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

const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const History = mongoose.model("History", historySchema);
module.exports = { User, Booking, History };
