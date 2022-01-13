const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Here are your orders:"
    })
})
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: `You ordered product number ${req.params.orderId}`,
    })
})
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: "Order was placed.",
        createdOrder : order
    })
})
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: `Order number ${req.params.orderId} was deleted.`
    })
})
module.exports = router;