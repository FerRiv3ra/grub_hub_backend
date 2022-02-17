const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    noPeople: {
        type: Number,
        required: [true, 'Number of people is required']
    },
    child: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: [true, 'The address is required']
    },
    postcode: {
        type: String,
        required: [true, 'The postcode is required']
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    customer_id: {
        type: Number
    },
    state: {
        type: Boolean,
        default: true
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
}

module.exports = model('User', UserSchema);