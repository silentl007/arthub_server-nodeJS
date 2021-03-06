const express = require('express');
const mongoModel = require('./model')
const router = express.Router();

// remove from cart
router.delete('/cartremove', async (req, res)=>{
    const productID = req.body.productID;
    const userID = req.body.userID;
    const accountType = req.body.accountType;
    
})

module.exports = router;