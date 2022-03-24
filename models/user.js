const { Schema, model } = require('mongoose');

const UserSchema = Schema({
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
    last: {
        type: String,
    },
    month: {
        type: Number,
        default: new Date().getMonth()
    },
    name: {
        type: String,
        required: [true, 'The name is required']
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
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    single: {
        type: Boolean,
        default: true,
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