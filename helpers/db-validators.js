const Delivery = require('../models/delivery');
const Role = require('../models/role');
const User = require('../models/user');

const validRole = async (role = '') => {
    const roleExist = await Role.findOne({role});
    if( !roleExist ){
        throw new Error(`${role} is not a valid role`);
    } 
}

const validUser = async (id) => {
    const existUser = await User.findById(id);
    if( !existUser ){
        throw new Error(`There are not user with ID ${id}` );
    }
}

const validDelivery = async (id) => {
    const existDelivery = await Delivery.findById(id);
    if( !existDelivery ){
        throw new Error(`There are not delivery with ID ${id}`);
    }
}

module.exports = {
    validRole,
    validUser,
    validDelivery
}