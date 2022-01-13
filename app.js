const express = require('express');
const productRoutes = require('./api/routes/products');
const app = express();
const orderRoutes = require('./api/routes/orders')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const downloadRoutes = require('./api/routes/downloads')

require("dotenv").config('.env');

// Morgan Logger middleware
app.use(morgan('dev'))

// BodyParser middleware 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connection to MongoDB using mongoose, comment the line below to not use mongoDB in case of no Internet connection,
// to test out other aspects of the application. Allowing the app to execute while no Internet will raise an exception.
mongoose.connect(`mongodb://user_01:${process.env.MONGO_DB_PASS}@node-shop-api-shard-00-00.eixwh.mongodb.net:27017,node-shop-api-shard-00-01.eixwh.mongodb.net:27017,node-shop-api-shard-00-02.eixwh.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-qxl1dn-shard-0&authSource=admin&retryWrites=true&w=majority`)

// DeprecationWarning error solution
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Headers", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/downloads', downloadRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message,
            description: `Cannot find ${req.originalUrl} on this server.`
        }
    })
}) 

module.exports = app;