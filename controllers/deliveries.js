const { response } = require('express');
const { initialDate, converToDate } = require('../helpers/get-dates');
const Delivery = require('../models/delivery');
const User = require('../models/user');

const createDelivery = async (req, res = response) => {
    const { amount, customer_id, uid, cant_toiletries } = req.body;

    const date = Date.now();

    const startDate = initialDate();

    const data = {
        amount, 
        customer_id,
        user: req.user._id,
        date,
        startDate
    }

    const existDelivery = await Delivery.find({customer_id, startDate});

    if(existDelivery[0]){
        return res.status(401).json({
            msg: 'This customer ID is alredy used this week'
        });
    }

    const user = await User.findById(uid);
    let { visits, toiletries } = user;
    let [a, m, d] = new Date().toISOString().slice(0, 10).split('-');
    last = `${d}/${m}/${a}`;

    toiletries = toiletries - cant_toiletries

    await User.findByIdAndUpdate(uid, { visits: visits + 1, last, toiletries})

    const delivery = new Delivery(data);

    await delivery.save();

    res.status(201).json(delivery);
}

const getAllDeliveries = async (req, res = response) => {
    const today = new Date();
    const { 
        startDate = '01/01/2022', 
        finalDate = today
    } = req.query;
    let final;

    const start = converToDate(startDate);
    if(typeof(finalDate) === 'string'){
        final = converToDate(finalDate, 'final');
    }else{
        final = finalDate;
    }

    if(start > today || start > final){
        return res.status(400).json({
            msg: 'The dates are not valid'
        });
    }

    if(final > today){
        final = today;
    }

    const deliveries = await Delivery.find({$and: [
        {date: {$gte: new Date(start), $lte: new Date(final)}},
        {state: true}
    ]});

    if(!deliveries){
        return res.status(204).json({
            msg: 'Nothing to show'
        })
    }

    res.json({deliveries})
}

const getDelivery = async (req, res = response) => {
    const { id } = req.params;
    const startDate = initialDate();

    const delivery = await Delivery.find({customer_id: id, startDate});

    if(delivery.length !== 0){
        return res.status(401).json({
            error: 'This customer ID is alredy used this week'
        });
    }

    res.status(200).json({
        msg: 'OK'
    });
}

const putDelivery = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...body } = req.body;

    const delivery = await Delivery.findByIdAndUpdate( id, body );

    res.json(delivery);
}

const deleteDelivery = async (req, res = response) => {
    const { id } = req.params;

    const delivery = await Delivery.findByIdAndUpdate( id, {state: false} );

    res.json(delivery);
}

module.exports = {
    createDelivery,
    getAllDeliveries,
    getDelivery,
    putDelivery,
    deleteDelivery
}