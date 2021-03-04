const express = require('express');
const mongoose = require('mongoose');
const id_generator = require('uuid');
const jwt = require('jsonwebtoken');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SendGridAPI);
require('dotenv')
const router = express.Router();
const mongoModel = require('./model')

// response codes
/**
 * 200 -successful - general successful
 * 400 -unsuccessful - register -- email already used
 */

// register route
router.post('/register', async (req, res) => {
    if (!req.body.account) {
        const dataBody = req.body;
        const dataGallery = await mongoModel.gallery.findOne({ email: req.body.email });
        const dataFreelance = await mongoModel.freelancer.findOne({ email: req.body.email });
        const dataCustomer = await mongoModel.customer.findOne({ email: req.body.email });
        if (dataGallery != null) {
            return res.status(400).json({ message: "This email is already used!" })
        } else if (dataFreelance != null) { return res.status(400).json({ message: "This email is already used!" }) }
        else if (dataCustomer != null) { return res.status(400).json({ message: "This email is already used!" }) }
        else {
            const token = jwt.sign(dataBody, process.env.TokenSecret, { expiresIn: '5m' });
            var emailURL = `localhost:3000/send/activate/${token}`
            console.log(emailURL);
            // const emailBody = {
            //     from: process.env.SendEmailAddress,
            //     to: dataBody.email,
            //     subject: `Account activation link`,
            //     html: `
            //     <h1> Please use the link to activate your account</h1>
            //     <h3> The link below will expire in five(5) minutes </h3>

            //     <h3>This email may contain subsentive information</h3>
            //     `};
            // sendgrid.send(emailBody).then(() => {
            //     return res.status(200).json({
            //         message: `email has been sent to ${data.email}. Follow the instructions to activate your account`
            //     })
            // }).catch((err) => {
            //     console.log(err);
            //     return res.status(400).json({
            //         message: err.message
            //     })
            // })
        }
    }
})

// activate account route
router.post('/activate/:token', async (req, res) => {
    const receivedToken = req.params.token;
    if (receivedToken) {
        jwt.verify(receivedToken, process.env.TokenSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Expired token!' });
            } else {
                const decodedToken = jwt.decode(receivedToken);
                if (decodedToken.account == "Gallery") {
                    const userEntry = new mongoModel.gallery({
                        userID: id_generator.v4(),
                        name: decodedToken.name,
                        email: decodedToken.email,
                        password: decodedToken.password,
                        address: decodedToken.address,
                        location: decodedToken.location,
                        account: decodedToken.account,
                        number: decodedToken.number,
                    });
                    userEntry.save((err) => {
                        if (err) {
                            res.status(400).json({ message: err })
                        } else {
                            res.status(200).json({ message: "Activation successful. You can login in!" })
                        }
                    })
                } else if (decodedToken.account == "Freelancer") {
                    const userEntry = new mongoModel.freelancer({
                        userID: id_generator.v4(),
                        name: decodedToken.name,
                        email: decodedToken.email,
                        password: decodedToken.password,
                        address: decodedToken.address,
                        location: decodedToken.location,
                        account: decodedToken.account,
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
                else {
                    const userEntry = new mongoModel.customer({
                        userID: id_generator.v4(),
                        name: decodedToken.name,
                        email: decodedToken.email,
                        password: decodedToken.password,
                        address: decodedToken.address,
                        location: decodedToken.location,
                        account: decodedToken.account,
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
        })
    }

})

// login route
router.post('/login', async (req, res) => {
    try { } catch (err) { }
})

// update user details
router.patch('/edit/:userID', async (req, res) => {
    try { } catch (err) { }
})

// delete item
router.delete('/remove/:userID', async (req, res) => {
    try { } catch (err) { }
})

module.exports = router