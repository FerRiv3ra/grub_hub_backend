const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const getUsers = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    if(Number(limit) === isNaN) limit = 5;
    if(Number(from) === isNaN) from = 0;
    const query = {state: true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const getUser = async (req, res = response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    res.json(user);
}

const postUsers = async (req, res = response) => {
    const { 
        child,
        dob,
        last = '',
        name,
        no_household = 1, 
        password,
        housing_provider = '',
        phone, 
        postcode,
        role = 'USER_ROLE', 
        visits = 0, 
    } = req.body;
    
    let {child_cant = 0, toiletries = 3, email = ''} = req.body;

    let customer_id = await User.countDocuments({role: 'USER_ROLE'});
    if(role === 'ADMIN_ROLE'){
        customer_id = 0;
    }else{
        customer_id += 1;
    }

    if(email === ''){
        email = `noemail${customer_id}@default.com`;
    }

    if(no_household - child_cant > 1){
        toiletries = 6;
    }

    if(!child){
        child_cant = 0;
    }

    const user = new User({
        customer_id, 
        child, 
        child_cant, 
        dob, 
        email,
        housing_provider, 
        name, 
        last, 
        password, 
        phone, 
        postcode: postcode.toUpperCase(), 
        role, 
        no_household, 
        toiletries, 
        visits
    });

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    
    await user.save();

    res.json(user);
}

const putUsers = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, ...body } = req.body;

    if( password ){
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, body );

    res.json(user);
}

const deleteUsers = async (req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {state: false});

    res.json(user);
}

module.exports = {
    getUsers,
    getUser,
    postUsers,
    putUsers,
    deleteUsers
}