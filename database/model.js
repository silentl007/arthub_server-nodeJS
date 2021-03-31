const mongoose = require('mongoose');
const dateFormat = require('dateformat');
var now = new Date()

const purchase_data = mongoose.Schema({
    orderID: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    itemnumber: {
        type: Number,
        required: true,
    },
    dateOrdered: {
        type: String,
        required: true,
    },
    dateDelivered: {
        type: String,
        required: false,
        default: ''
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    clearAgentID: {
        type: String,
        required: false,
        default: ''
    },
    itemscost: {
        type: Number,
        required: true,
    },
    purchaseditems: {
        type: Array,
        required: true,
    },
})

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
        type: String,
        default: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
    },
    dateType: {
        type: Date,
        default: Date.now,
    }
})

module.exports.gallery = mongoose.model('gallery_users', user_register);
module.exports.freelancer = mongoose.model('freelance_users', user_register);
module.exports.customer = mongoose.model('customer_users', user_register);
module.exports.app_purchases = mongoose.model('delivery_purchases', purchase_data);
module.exports.test = mongoose.model('test_db', user_register);