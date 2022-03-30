const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    blocked: {
        type: Boolean,
        default: false
    },
    child: {
        type: Boolean,
        default: false
    },
    child_cant: {
        type: Number,
        default: 0
    },
    customer_id: {
        type: Number
    },
    dob: {
        type: String,
        required: [true, 'Date of birth is required']
    },
    email: {
        type: String,
        unique: true
    },
    housing_provider: {
        type: String,
    },
    last: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    no_household: {
        type: Number,
        default: 1,
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    phone: {
        type: String
    },
    postcode: {
        type: String,
        required: [true, 'The postcode is required']
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VOLUNTEER']
    },
    state: {
        type: Boolean,
        default: true
    },
    toiletries: {
        type: Number,
        default: 3
    },
    visits: {
        type: Number,
        default: 0
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);