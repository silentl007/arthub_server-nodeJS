const express = require('express');
const mongoModel = require('./model')
const router = express.Router();

// get gallery data
router.get('/gallery', async (req, res) => {
    try {
        var sendData = [];
        const dataGallery = await mongoModel.gallery.find();
        if (dataGallery != null) {
            // logic to loop through to extract specific information needed
            for (var i = 0; i < dataGallery.length; i++) {
                var mapData = {
                    name: dataGallery[i].name, address: dataGallery[i].address,
                    location: dataGallery[i].location, number: dataGallery[i].number,
                    works: dataGallery[i].works
                };
                sendData.push(mapData);
            }
        }
        return res.status(200).json(sendData);
    } catch (err) {
        console.log(err)
    }

});

// get freelance data
router.get('/freelance', async (req, res) => {
    try {
        var sendData = [];
        const dataFreelance = await mongoModel.freelancer.find();
        if (dataFreelance != null) {
            // logic to loop through to extract specific information needed
            for (var i = 0; i < dataFreelance.length; i++) {
                var mapData = {
                    name: dataFreelance[i].name, address: dataFreelance[i].address,
                    location: dataFreelance[i].location, number: dataFreelance[i].number,
                    works: dataFreelance[i].works
                };
                sendData.push(mapData);
            }
        }
        return res.status(200).json(sendData);
    } catch (err) {
        console.log(err)
    }
});

// get user data
router.get('/user/:id', async (req, res) => {

})

module.exports = router;