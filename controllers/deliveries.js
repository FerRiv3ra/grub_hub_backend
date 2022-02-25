const { response } = require('express');
const Delivery = require('../models/delivery');

const createDelivery = async (req, res = response) => {
    const { amount, customer_id } = req.body;

    const date = Date.now();

    const data = {
        amount, 
        customer_id,
        user: req.user._id,
        date
    }

    const delivery = new Delivery(data);

    await delivery.save();

    res.status(201).json(delivery);
}

module.exports = {
    createDelivery
}