const mailgen = require('mailgen');
const nodemailer = require('nodemailer');

class EmailSender {
    // for the email body, you can cc, bcc other email addresses and add attachments
    // check video 'Send email with Nodemailer using gmail account - Nodejs' for details
    // used mail generator for the template

    // generator for the theme, product name and link
    registerMail(userName, userEmail, emailURL, res) {
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
                console.log('Success!')
                return res.status(200).json({ message: 'Email has been sent!' });
            }
        })
    }

    purchaseUser(userName, userEmail, orderID, res) {
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
                intro: 'Thank you for shopping at ArtHub!.',
                action: {
                    instructions: `Your purchase has been confirmed with order ID - ${orderID}. It will be required before items are released! `,
                    button: {
                        color: '#22BC66',
                        text: 'Thank You',
                        link: `http://google.com`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        var generateEmailHTML = mailgenerator.generate(emailContent);
        let emailBody = {
            from: process.env.ArtEmail,
            to: userEmail,
            subject: `Purchase Confirmation`,
            html: `${generateEmailHTML}              `
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
            } else {
                console.log('Success!')
            }
        })
    }

    notifyArtist(artistEmail, artistName, artwork, res) {
        const mailgenerator = new mailgen({
            theme: 'default',
            product: {
                name: 'ArtHub',
                link: 'https://mailgen.js/'
            }
        });
        let emailContent = {
            body: {
                name: `${artistName}`,
                intro: 'Congrats! A customer has purchased your item.',
                action: {
                    instructions: `Your artwork ${artwork} has been purchased. Please deliver to the respective location within the next three (3) working days! `,
                    button: {
                        color: '#22BC66',
                        text: 'Deliver',
                        link: `http://google.com`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        var generateEmailHTML = mailgenerator.generate(emailContent);
        let emailBody = {
            from: process.env.ArtEmail,
            to: artistEmail,
            subject: `Notification of Purchase`,
            html: `${generateEmailHTML}              `
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
            } else {
                console.log('Success!')
            }
        })
    }

    orderDelivered(useremail, username, orderID, res) {
        const mailgenerator = new mailgen({
            theme: 'default',
            product: {
                name: 'ArtHub',
                link: 'https://mailgen.js/'
            }
        });
        let emailContent = {
            body: {
                name: `${username}`,
                intro: 'Thank you for shopping with us!',
                action: {
                    instructions: `Your order with ID - ${orderID} has been fulfilled! Thank you for shopping with Arthub! See you soon! `,
                    button: {
                        color: '#22BC66',
                        text: 'Deliver',
                        link: `http://google.com`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        var generateEmailHTML = mailgenerator.generate(emailContent);
        let emailBody = {
            from: process.env.ArtEmail,
            to: useremail,
            subject: `Order Delivered`,
            html: `${generateEmailHTML}              `
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
            } else {
                console.log('Success!')
            }
        })
    }
}

module.exports = EmailSender;