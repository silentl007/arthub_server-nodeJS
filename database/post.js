const express = require('express');
const nodemailer = require('nodemailer');
const id_generator = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const mongoModel = require('./model')
const mailgen = require('mailgen');
const dateFormat = require('dateformat');
var now = new Date();

/** response codes
 * 200 -successful - general successful
 * 400 -unsuccessful - register -- email already used
 * 402 -unsuccessful - login -- email not found
 * 401 -unsuccessful - login -- password does not match
 * 400 -failed - all routes - console.log
 */

// register route
router.post('/register', async (req, res) => {
    const dataBody = req.body;
    const dataGallery = await mongoModel.gallery.findOne({ email: dataBody.email });
    const dataFreelance = await mongoModel.freelancer.findOne({ email: dataBody.email });
    const dataCustomer = await mongoModel.customer.findOne({ email: dataBody.email });
    // logic to find if email has been used to register in any of the categories
    if (dataGallery != null) {
        return res.status(400).json({ message: "This email is already used!" })
    } else if (dataFreelance != null) { return res.status(400).json({ message: "This email is already used!" }) }
    else if (dataCustomer != null) { return res.status(400).json({ message: "This email is already used!" }) }
    else {
        // Sends email
        const token = jwt.sign(dataBody, process.env.TokenSecret, { expiresIn: '5m' });
        var emailURL = `${process.env.URL}/apiS/activate/${token}`;
        sendMail(dataBody.name, dataBody.email, emailURL, res);
    }
})

// activate account route
router.get('/activate/:token', async (req, res) => {
    const receivedToken = req.params.token;
    if (receivedToken) {
        jwt.verify(receivedToken, process.env.TokenSecret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Expired token!' });
            } else {
                const decodedToken = jwt.decode(receivedToken);
                // logic to check if the user is already registered (using the link twice within five minutes will create another account)
                const dataGallery = await mongoModel.gallery.findOne({ email: decodedToken.email });
                const dataFreelance = await mongoModel.freelancer.findOne({ email: decodedToken.email });
                const dataCustomer = await mongoModel.customer.findOne({ email: decodedToken.email });
                // logic to find if email has been used to register in any of the categories
                if (dataGallery != null) {
                    return res.status(400).json({ message: "This user already exists!" })
                } else if (dataFreelance != null) { return res.status(400).json({ message: "This user already exists!" }) }
                else if (dataCustomer != null) { return res.status(400).json({ message: "This user already exists!" }) }
                else {
                    // logic to determine which collection to store the registered user based on accoutnt type
                    if (decodedToken.accountType == "Gallery") {
                        const userEntry = new mongoModel.gallery({
                            userID: id_generator.v4(),
                            name: decodedToken.name,
                            email: decodedToken.email,
                            password: decodedToken.password,
                            address: decodedToken.address,
                            location: decodedToken.location,
                            accountType: decodedToken.accountType,
                            number: decodedToken.number,
                        });
                        userEntry.save((err) => {
                            if (err) {
                                res.status(400).json({ message: err })
                            } else {
                                res.status(200).json({ message: "Activation successful. You can login in!" })
                            }
                        })
                    } else if (decodedToken.accountType == "Freelancer") {
                        const userEntry = new mongoModel.freelancer({
                            userID: id_generator.v4(),
                            name: decodedToken.name,
                            email: decodedToken.email,
                            password: decodedToken.password,
                            address: decodedToken.address,
                            location: decodedToken.location,
                            accountType: decodedToken.accountType,
                            number: decodedToken.number,
                            avatar: decodedToken.avatar,
                            aboutme: decodedToken.aboutme,
                        });
                        userEntry.save((err) => {
                            if (err) {
                                res.status(400).json({ message: err })
                            } else {
                                res.status(200).json({ message: "Activation successful. You can login in!" })
                            }
                        })
                    }
                    else {
                        const userEntry = new mongoModel.customer({
                            userID: id_generator.v4(),
                            name: decodedToken.name,
                            email: decodedToken.email,
                            password: decodedToken.password,
                            address: decodedToken.address,
                            location: decodedToken.location,
                            accountType: decodedToken.accountType,
                            number: decodedToken.number,
                        });
                        userEntry.save((err) => {
                            if (err) {
                                res.status(400).json({ message: err })
                            } else {
                                res.status(200).json({ message: "Activation successful. You can login in!" })
                            }
                        })
                    }
                }
            }
        })
    }

})

// login route
router.post('/login', async (req, res) => {
    try {
        const dataBody = req.body;
        const dataGallery = await mongoModel.gallery.findOne({ email: dataBody.email });
        const dataFreelance = await mongoModel.freelancer.findOne({ email: dataBody.email });
        const dataCustomer = await mongoModel.customer.findOne({ email: dataBody.email });
        if (dataGallery != null) {
            if (dataGallery.password == dataBody.password) {
                const data = {
                    userID: dataGallery.userID, name: dataGallery.name,
                    email: dataGallery.email, password: dataGallery.password,
                    address: dataGallery.address, location: dataGallery.location,
                    accountType: dataGallery.accountType, avatar: dataGallery.avatar, aboutme: dataGallery.aboutme,
                    number: dataGallery.number
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: data };
                return res.status(200).json(sendUser);
            } else { res.status(401).json({ message: 'The password is not correct' }) }
        }
        else if (dataFreelance != null) {
            if (dataFreelance.password == dataBody.password) {
                const data = {
                    userID: dataFreelance.userID, name: dataFreelance.name,
                    email: dataFreelance.email, password: dataFreelance.password,
                    address: dataFreelance.address, location: dataFreelance.location,
                    accountType: dataFreelance.accountType, avatar: dataFreelance.avatar, aboutme: dataFreelance.aboutme,
                    number: dataFreelance.number
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: data };
                return res.status(200).json(sendUser);
            } else { res.status(401).json({ message: 'The password is not correct' }) }
        }
        else if (dataCustomer != null) {
            if (dataCustomer.password == dataBody.password) {
                const data = {
                    userID: dataCustomer.userID, name: dataCustomer.name,
                    email: dataCustomer.email, password: dataCustomer.password,
                    address: dataCustomer.address, location: dataCustomer.location,
                    accountType: dataCustomer.accountType, avatar: dataCustomer.avatar, aboutme: dataCustomer.aboutme,
                    number: dataCustomer.number
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: data };
                return res.status(200).json(sendUser);
            } else { res.status(401).json({ message: 'The password is not correct' }) }
        }
        else { res.status(402).json({ message: "Email not registered" }) }
    } catch (err) {
        res.status(400);
        console.log(err)
    }
})

// update user details
router.post('/edit', async (req, res) => {
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    if (accountType == 'Gallery') {
        try {
            const patched = await mongoModel.gallery.updateOne({ userID: userID },
                {
                    $set: {
                        name: req.body.name, address: req.body.address,
                        number: req.body.number, location: req.body.location
                    }
                })
            return res.status(200).json(patched);
        } catch (err) {
            console.log(err);
            return res.status(400);
        }
    } else if (accountType == 'Customer') {
        try {
            const patched = await mongoModel.customer.updateOne({ userID: userID },
                {
                    $set: {
                        name: req.body.name, address: req.body.address,
                        number: req.body.number, location: req.body.location
                    }
                })
            return res.status(200).json(patched);
        } catch (err) {
            console.log(err);
            return res.status(400);
        }
    } else {
        try {
            const patched = await mongoModel.freelancer.updateOne({ userID: userID },
                {
                    $set: {
                        name: req.body.name, address: req.body.address,
                        number: req.body.number, location: req.body.location,
                        aboutme: req.body.aboutme, avatar: req.body.avatar
                    }
                })
            return res.status(200).json(patched);
        } catch (err) {
            console.log(err);
            return res.status(400);
        }
    }

})

// upload works for freelance and gallery
router.post('/uploadworks', async (req, res) => {
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    // I know data can be simplified using data = req.body, then data.productID = id_generator.v4()
    // just accept it like that, lol, makes properties easier to track in my head
    const data = {
        userID: req.body.userID,
        productID: id_generator.v4(),
        name: req.body.name,
        accountType: req.body.accountType,
        email: req.body.email,
        product: req.body.product,
        cost: req.body.cost,
        type: req.body.type,
        avatar: req.body.avatar,
        description: req.body.description,
        dimension: req.body.dimension,
        weight: req.body.weight,
        materials: req.body.materials,
        images: req.body.images,
        date: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
    }
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.updateOne({ userID: userID }, { $push: { works: data } });
            return res.status(200).json(query);
        } catch (err) {
            console.log(err)
            return res.status(400);
        }
    }
    else {
        try {
            const query = await mongoModel.freelancer.updateOne({ userID: userID }, { $push: { works: data } });
            return res.status(200).json(query);
        } catch (err) {
            console.log(err)
            return res.status(400);
        }
    }

})

// add to cart
router.post('/cartadd/:userID/:accountType', async (req, res) => {
    const itemDetails = req.body;
    const userID = req.params.userID;
    const accountType = req.params.accountType
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.updateOne({ userID: userID }, { $push: { cart: itemDetails } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    } else if (accountType == 'Freelancer') {
        try {
            const query = await mongoModel.freelancer.updateOne({ userID: userID }, { $push: { cart: itemDetails } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    } else {
        try {
            const query = await mongoModel.customer.updateOne({ userID: userID }, { $push: { cart: itemDetails } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    }

})

router.post('/checkcart', async (req, res) => {
    const usercart = req.body.purchaseditems
    const body = req.body
    console.log(`user cart - ${usercart}`)
    console.log(`just body - ${body}`)
    for (var item in usercart) {
        console.log(`looped item - ${item}`)
        if (item.accountType == 'Gallery') {
            try {
                const query = await mongoModel.gallery.findOne({ userID: item.userID })
                if (query.works != null) {
                    var productIDs = []
                    for (var qitems in query.works) {
                        productIDs.push(qitems.productID)
                    }
                    if (productIDs.includes(item.productID)) {
                        continue;
                    } else {
                        res.status(404).json({ itemname: item.product })
                        break
                    }
                } else {
                    res.status(404).json({ itemname: item.product })
                    break
                }
            } catch (error) {
                console.log(`an error occured Gallery - ${error}`)
                return res.status(400)
            }

        } else {
            try {
                const query = await mongoModel.freelancer.findOne({ userID: item.userID })
                if (query.works != null) {
                    var productIDs = []
                    for (var qitems in query.works) {
                        productIDs.push(qitems.productID)
                    }
                    if (productIDs.includes(item.productID)) {
                        continue;
                    } else {
                        res.status(404).json({ itemname: item.product })
                        break
                    }
                } else {
                    res.status(404).json({ itemname: item.product })
                    break
                }
            } catch (error) {
                console.log(`an error occured Freelancer - ${error}`)
                return res.status(400)
            }

        }
    } return res.status(200)
})

router.post('/purchaseorders', async (req, res) => {
    const purchaseditems = req.body.purchaseditems;
    const userID = req.body.userID;
    const accountType = req.body.accountType
    const itemscost = req.body.itemscost
    const totalcost = req.body.totalcost
    const itemnumber = req.body.itemnumber
    const deliveryAddress = req.body.deliveryAddress
    const body = {
        orderID: id_generator.v4(),
        userID: userID,
        accountType: accountType,
        status: "Pending",
        itemnumber: itemnumber,
        dateOrdered: dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        deliveryAddress: deliveryAddress,
        date: Date.now,
        totalcost: totalcost,
        itemscost: itemscost,
        purchaseditems: purchaseditems,
    }
    if (accountType == 'Gallery') {
        const resetcart = [];
        try {
            const reset = await mongoModel.gallery.findOneAndReplace({ userID: userID }, { cart: resetcart });
            const query = await mongoModel.gallery.updateOne({ userID: userID }, { $push: { orders: body } });
            return res.status(200)
        } catch (error) {
            console.log(error);
            return res.status(400)
        }

    } else if (accountType == 'Freelancer') {
        try {
            const query = await mongoModel.freelancer.updateOne({ userID: userID }, { $push: { orders: body } });
            return res.status(200)
        } catch (error) {
            console.log(error);
            return res.status(400)
        }
    } else {
        try {
            const query = await mongoModel.customer.updateOne({ userID: userID }, { $push: { orders: body } });
            return res.status(200)
        } catch (error) {
            console.log(error);
            return res.status(400)
        }
    }
})

function sendMail(userName, userEmail, emailURL, res) {
    // for the email body, you can cc, bcc other email addresses and add attachments
    // check video 'Send email with Nodemailer using gmail account - Nodejs' for details
    // used mail generator for the template

    // generator for the theme, product name and link
    const mailgenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'ArtHub',
            link: 'https://mailgen.js/'
        }
    });

    // creating the content of the email
    let emailContent = {
        body: {
            name: `${userName}`,
            intro: 'Welcome to ArtHub! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with ArtHub, please click the link below. The link will expire in five (5) minutes',
                button: {
                    color: '#22BC66',
                    text: 'Activate your account',
                    link: `${emailURL}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    // transforming the content to HTML
    var generateEmailHTML = mailgenerator.generate(emailContent);

    // creating the email body used by nodemailer
    let emailBody = {
        from: process.env.ArtEmail,
        to: userEmail,
        subject: `Account activation link`,
        html: `${generateEmailHTML}
                `
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ArtEmail,
            pass: process.env.ArtPassword,
        }
    })
    transporter.sendMail(emailBody, async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: 'Email was not sent! Check console' });
        } else {
            console.log('Success!', data)
            return res.status(200).json({ message: 'Email has been sent!' });
        }
    })
}

module.exports = router