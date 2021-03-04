const express = require('express');
const mongoModel = require('./model')
const router = express.Router();

// get gallery data
router.get('/gallery', async (req, res) => {
    try {
        const dataGallery = await mongoModel.gallery.find();
        return res.status(200).json(dataGallery);
    } catch (err) {
        console.log(err)
    }

});

// get freelance data
router.get('/freelance', async (req, res) => {
    try {
        const dataFreelance = await mongoModel.freelancer.find();
        return res.status(200).json(dataFreelance);
    } catch (err) {
        console.log(err)
    }
});

// get user data
router.get('/user/:id', async (req, res) => {

})

module.exports = router;