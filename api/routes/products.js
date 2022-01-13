const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: `${req.protocol + '://' +  req.get('host') + req.originalUrl +  '/' + doc._id}`
                    }
                }
            })
        }
        console.log(response)
        // if (result.length >= 0) {
        res.status(200)
        .json(response)
        // } else {
        //     res.status(404)
        //     .json({
        //         message: "No entries found on this route."
        //     })
        // }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
    })
    product.save()
    .then(result => {
        console.log(result)
        res.status(200).json({
            productCreated : {
                name: result.name,
                price: result.price,
                request: {
                    type: "GET",
                    url: `${req.protocol + '://' +  req.get('host') + req.originalUrl + result._id}`
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500)
        .json({
            'message': `${err['message']}`
        })
    })
})
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Product.findById(id)
    .select("name price _")
    .exec()
    .then(result => {
        console.log(result)
        if (result != null) {
            res.status(200).json({
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    description: 'GET-ALL-PRODUCTS',
                    url: `${req.protocol + '://' +  req.get('host') + '/products'}`
                }
            })
        } else {
            res.status(404).json({
                message: "No entry found for provided product ID."
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500)
        .json({
            error: err
        })
    })
})
router.patch('/:id', (req, res, next) => {
    var id = req.params.id;
    // Okay, this needs some talking. A few words on what we are doing below this comment.
    // So updateOperations is an empty JavaScript object that will hold the values (or properties) of the product that we wanna change.
    // Maybe we wanna change just the price of the product or just the name.
    // For that purpose, the updateOperations object will be populated through the for.. loop that will iterate through
    // an array that we pass to the request body, that we can do, because an array is also valid JSON.
    // That array will have JavaScript objects as elements, where each element will have two key-value pairs.
    // Where key of the first pair will be 'propName' and the value of it will be the property name of the object that we wanna change.
    // And the key of the second pair will be 'value' with the value of it being the new value for the property.
    // That's a lot to soak in. Here's an example of how the request body of a PATCH request should look like:
    /*
    [
        {'propName': 'name', 'value': 'New Name of the Product.'},
        {'propName': 'price', 'value': 'new Price of the Product.'}
    ]
    */
    // The example above patches the name as well as the price of the product. But if you wanna change just one property,
    // only add object for that property, for.. loop will handle the rest.
    // It is worth noting that changing the id of the product is not worth it, because it will be just like creating a new product
    // Because products are identified by their Ids.
    // Line 124 through 128 will send the request to only update the properties mentioned in the request body array.
    const updateOperations = {}
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }
    Product.updateOne({_id: req.params.id}, {$set : updateOperations}) // $set is not an orbitrary word, this is recognized by mongoDB to patch properties mentioned in 'updateOperations'.
    .exec()
    .then(result => {
        res.status(200)
        .json({
            message: "Product updated successfully.",
            request: {
                type: "GET",
                description: "GET_UPDATED_PRODUCT",
                url: `${req.protocol + '://' +  req.get('host') + '/products' + id}`
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500)
        .json({
            error : err
        })
    })
})
router.delete('/:id', (req, res, next) => {
    Product.remove({_id : req.params.id})
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: "Product Deleted.",
            request: {
                type: "POST",
                description: "CREATE-NEW-PRODUCT",
                url: `${req.protocol + '://' +  req.get('host') + '/products'}`,
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})
module.exports = router;