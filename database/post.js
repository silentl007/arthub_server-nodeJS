const express = require('express');
const mongoose = require('mongoose');
const id_generator = require('uuid');
const jwt = require('jsonwebtoken');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SendGridAPI);
require('dotenv')
const router = express.Router();
const mongoModel = require('./model')

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
        //     <h2>insert link</h2>
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
                // logic to determine which collection to store the registered user based on accoutnt type
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
                    account: dataGallery.account, avatar: dataGallery.avatar, aboutme: dataGallery.aboutme
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: dataGallery };
                return res.status(200).json(sendUser);
            } else { res.status(401).json({ message: 'The password is not correct' }) }
        }
        else if (dataFreelance != null) {
            if (dataFreelance.password == dataBody.password) {
                const data = {
                    userID: dataFreelance.userID, name: dataFreelance.name,
                    email: dataFreelance.email, password: dataFreelance.password,
                    address: dataFreelance.address, location: dataFreelance.location,
                    account: dataFreelance.account, avatar: dataFreelance.avatar, aboutme: dataFreelance.aboutme
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: dataFreelance };
                return res.status(200).json(sendUser);
            } else { res.status(401).json({ message: 'The password is not correct' }) }
        }
        else if (dataCustomer != null) {
            if (dataCustomer.password == dataBody.password) {
                const data = {
                    userID: dataCustomer.userID, name: dataCustomer.name,
                    email: dataCustomer.email, password: dataCustomer.password,
                    address: dataCustomer.address, location: dataCustomer.location,
                    account: dataCustomer.account, avatar: dataCustomer.avatar, aboutme: dataCustomer.aboutme
                }
                const tokenGenerated = jwt.sign(data, process.env.TokenSecret, { expiresIn: '7d' });
                const sendUser = { token: tokenGenerated, user: dataCustomer };
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
    const data = {
        userID: req.body.userID,
        productID: id_generator.v4(),
        name: req.body.name,
        accountType: req.body.accountType,
        product: req.body.product,
        cost: req.body.cost,
        type: req.body.type,
        avatar: req.body.avatar,
        description: req.body.description,
        dimension: req.body.dimension,
        weight: req.body.weight,
        'material used': req.body.materials,
        images: req.body.images,
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

// delete item
router.delete('/remove/:userID', async (req, res) => {
    try { } catch (err) { }
})

module.exports = router