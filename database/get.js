const express = require('express');
const mongoModel = require('./model')
const router = express.Router();

// get gallery data
router.get('/gallery', async (req, res) => {
    var sendData = [];
    try {
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
    var sendData = [];
    try {
        const dataFreelance = await mongoModel.freelancer.find();
        if (dataFreelance != null) {
            // logic to loop through to extract specific information needed
            for (var i = 0; i < dataFreelance.length; i++) {
                var mapData = {
                    name: dataFreelance[i].name, address: dataFreelance[i].address,
                    aboutme: dataFreelance[i].aboutme, avatar: dataFreelance[i].avatar,
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

// get user data //

// get sold works for freelancers and gallery
router.get('/soldworks', async (req, res) => {
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.findOne({ userID: userID });
            return res.status(200).send(query.soldworks);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }

    } else {
        try {
            const query = await mongoModel.freelancer.findOne({ userID: userID });
            return res.status(200).send(query.soldworks);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }
    }

})

// get uploaded works for freelancers and gallery
router.get('/uploaded', async (req, res) => {
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.findOne({ userID: userID });
            return res.status(200).send(query.works);
        } catch (error) {
            console.log(error);
            return res.status(400);
        }

    } else {
        try {
            const query = await mongoModel.freelancer.findOne({ userID: userID });
            return res.status(200).send(query.works);
        } catch (error) {
            console.log(error);
            return res.status(400);
        }
    }

})

// get orders for all users
router.get('/orders', async (req, res) => {
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.findOne({ userID: userID });
            return res.status(200).send(query.orders);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }

    } else if (accountType == 'Freelancer') {
        try {
            const query = await mongoModel.freelancer.findOne({ userID: userID });
            return res.status(200).send(query.orders);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }
    }
    else {
        try {
            const query = await mongoModel.customer.findOne({ userID: userID });
            return res.status(200).send(query.orders);
        } catch (error) {
            console.log(error);
            return res.status(400);
        }
    }

})

// get cart items for all users
router.get('/cartget/:userID/:accountType', async (req, res) => {
    const userID = req.params.userID;
    const accountType = req.params.accountType;
    if (accountType == 'Gallery') {
        try {
            const query = await mongoModel.gallery.findOne({ userID: userID });
            console.log(typeof(query.cart));
            console.log(query.cart);
            return res.status(200).send(query.cart);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }

    } else if (accountType == 'Freelancer') {
        try {
            const query = await mongoModel.freelancer.findOne({ userID: userID });
            return res.status(200).send(query.cart);
        } catch (error) {
            console.log(error);
            return res.status(400);

        }
    }
    else {
        try {
            const query = await mongoModel.customer.findOne({ userID: userID });
            return res.status(200).send(query.cart);
        } catch (error) {
            console.log(error);
            return res.status(400);
        }
    }

})

module.exports = router;