const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    /*
    On line 13 --> 20, we can also use
        name: String,
        price: Number,
    to tell the type of property to be put when creating the product.
    But putting a JavaScript object allows us to go in detail about our property, allowing us to set wether or not
    a property is required to create the product.
    */
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model("Product", productSchema);