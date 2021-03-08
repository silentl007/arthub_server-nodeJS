const express = require('express');
const cors = require('cors');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const post = require('./database/post');
const get = require('./database/get');
const reset = require('./database/reset');
const remove = require('./database/remove')
require('dotenv/config');

const app = express();
// MiddleWare for all routes
app.use(cors());
app.use(bodyParser.json());

// MiddleWare for data sending route
app.use('/apiS', post)

// MiddleWare for receiving data route
app.use('/apiR', get)

// MiddleWare for removing items route
app.use('/apiD', remove)

// Middleware for password reset route
app.use('/apiC', reset)


// Connect to mongo database
mongo.connect(process.env.MongoString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error) => {
    if (error) {
        console.log(error);
    } else
        console.log('Connected!');
})

app.listen(3000);