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
    }

});


const bookingSchema = new mongoose.Schema({
    tableid: {
        type: String,
    },
    date: {
        type: Date, // Sử dụng kiểu dữ liệu Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
    }
})
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { User, Allcode, Booking };
