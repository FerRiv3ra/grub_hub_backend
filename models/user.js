const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  address: {
    type: String,
    default: '',
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  child: {
    type: Boolean,
    default: false,
  },
  childCant: {
    type: Number,
    default: 0,
  },
  customerId: {
    type: Number,
  },
  dob: {
    type: String,
    required: [true, 'Date of birth is required'],
  },
  firstName: {
    type: String,
    required: [true, 'The fisrt name is required'],
  },
  housingProvider: {
    type: String,
  },
  lastVisit: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    required: [true, 'The last name is required'],
  },
  noHousehold: {
    type: Number,
    default: 1,
  },
  pensioner: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: '',
  },
  postcode: {
    type: String,
    required: [true, 'The postcode is required'],
  },
  town: {
    type: String,
    default: '',
  },
  visits: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model('User', UserSchema);
