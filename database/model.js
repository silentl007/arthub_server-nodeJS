const mongoose = require('mongoose');
const dateFormat = require('dateformat');
var now = new Date()

const user_register = mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    aboutme: {
        type: String,
        required: false,
        default: '',
    },
    avatar: {
        type: String,
        required: false,
        default: '',
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    orders: {
        type: Array,
        default: [],
    },
    works: {
        type: Array,
        default: [],
    },
    soldworks: {
        type: Array,
        default: [],
    },
    cart: {
        type: Array,
        default: [],
    },
    dateCreated: {
        type: Date,
        default: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
    }
})

module.exports.gallery = mongoose.model('gallery_users', user_register);
module.exports.freelancer = mongoose.model('freelance_users', user_register);
module.exports.customer = mongoose.model('customer_users', user_register);
module.exports.test = mongoose.model('test_db', user_register);