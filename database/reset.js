const express = require('express');
const router = express.Router();
const mongoModel = require('./model')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

// reset password route
router.put('/resetpassword', async (req, res) => {
    const dataGallery = await mongoModel.gallery.findOne({ email: req.body.email });
    const dataFreelance = await mongoModel.freelancer.findOne({ email: req.body.email });
    const dataCustomer = await mongoModel.customer.findOne({ email: req.body.email });
    if (dataGallery != null) {
        const dataBody = { email: req.body.email, password: req.body.password, accountType: 'Gallery', name: dataGallery.name }
        const token = jwt.sign(dataBody, process.env.TokenSecret, { expiresIn: '5m' });
        var emailURL = `${process.env.URL}/apiC/resetpassword/${token}`;
        sendMail(dataBody.name, dataBody.email, emailURL, res);
    } else if (dataFreelance != null) {
        const dataBody = { email: req.body.email, password: req.body.password, accountType: 'Freelancer', name: dataGallery.name }
        const token = jwt.sign(dataBody, process.env.TokenSecret, { expiresIn: '5m' });
        var emailURL = `${process.env.URL}/apiC/resetpassword/${token}`;
        sendMail(dataBody.name, dataBody.email, emailURL, res);
    } else if (dataCustomer != null) {
        const dataBody = { email: req.body.email, password: req.body.password, accountType: 'Customer', name: dataGallery.name }
        const token = jwt.sign(dataBody, process.env.TokenSecret, { expiresIn: '5m' });
        var emailURL = `${process.env.URL}/apiC/resetpassword/${token}`;
        sendMail(dataBody.name, dataBody.email, emailURL, res);
    } else {
        return res.status(401).json({ message: 'Email not found' });
    }


})


// update password
router.post('/updatepassword/:token', async (req, res) => {
    const receivedToken = req.params.token;
    if (receivedToken) {
        jwt.verify(receivedToken, process.env.TokenSecret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Expired token!' });
            } else {
                const decodedToken = jwt.decode(receivedToken);
                // logic to determine which collection to store the registered user based on accoutnt type
                if (decodedToken.accountType == "Gallery") {
                    try {
                        const updatePassword = await mongoModel.gallery.updateOne(
                            { email: req.body.email }, { $set: { password: decodedToken.password } });
                        return res.status(200).json({ message: 'Password change successfully!' });
                    } catch (error) {
                        console.log(error);
                        return res.status(400).json({ message: 'Password change unsuccessful!' });
                    }
                } else if (decodedToken.accountType == "Customer") {
                    try {
                        const updatePassword = await mongoModel.customer.updateOne(
                            { email: req.body.email }, { $set: { password: decodedToken.password } });
                        return res.status(200).json({ message: 'Password change successfully!' });
                    } catch (error) {
                        console.log(error);
                        return res.status(400).json({ message: 'Password change unsuccessful!' });
                    }
                } else {
                    try {
                        const updatePassword = await mongoModel.freelancer.updateOne(
                            { email: req.body.email }, { $set: { password: decodedToken.password } });
                        return res.status(200).json({ message: 'Password change successfully!' });
                    } catch (error) {
                        console.log(error);
                        return res.status(400).json({ message: 'Password change unsuccessful!' });
                    }
                }
            }
        })
    }
})

function sendMail(userName, userEmail, emailURL, res) {
    // for the email body, you can cc, bcc other email addresses and add attachments
    // check video 'Send email with Nodemailer using gmail account - Nodejs' for details
    const mailgenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'ArtHub',
            link: 'https://mailgen.js/'
        }
    });
    let emailContent = {
        body: {
            name: `${userName}`,
            intro: 'This email was sent for password reset.',
            action: {
                instructions: 'To reset password, please click the link below. If password reset was not initiated by you, please ignore. The link will expire in five (5) minutes',
                button: {
                    color: '#22BC66',
                    text: 'Reset password',
                    link: `${emailURL}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var generateEmailHTML = mailgenerator.generate(emailContent);
    let emailBody = {
        from: process.env.ArtEmail,
        to: userEmail,
        subject: `Password reset`,
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

module.exports = router;