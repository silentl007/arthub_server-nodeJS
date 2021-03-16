const express = require('express');
const mongoModel = require('./model')
const router = express.Router();

// remove item from cart all users
router.delete('/cartremove/:userID/:productID/:accountType', async (req, res) => {
    const productID = req.params.productID;
    const userID = req.params.userID;
    const accountType = req.params.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.updateOne({ userID: userID },
                { $pull: { cart: { productID: productID } } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    } else if (accountType == 'Freelancer') {
        try {
            const query = await mongoModel.freelancer.updateOne({ userID: userID },
                { $pull: { cart: { productID: productID } } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    } else {
        try {
            const query = await mongoModel.customer.updateOne({ userID: userID },
                { $pull: { cart: { productID: productID } } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    }
})

// remove uploaded item for gallery and freelancer
router.delete('/uploadremove/:userID/:productID/:accountType', async (req, res) => {
    const productID = req.params.productID;
    const userID = req.params.userID;
    const accountType = req.params.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.updateOne({ userID: userID },
                { $pull: { works: { productID: productID } } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    } else {
        try {
            const query = await mongoModel.freelancer.updateOne({ userID: userID },
                { $pull: { works: { productID: productID } } });
            return res.status(200).json(query)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Error occurred, check console' })
        }
    }
})

module.exports = router;