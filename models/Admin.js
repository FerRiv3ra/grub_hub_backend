const { Schema, model } = require('mongoose');

const AdminSchema = Schema({
  email: {
    type: String,
    required: [true, 'Date of birth is required'],
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: [true, 'The fisrt name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'The last name is required'],
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  token: {
    type: String,
    default: '',
  },
});

AdminSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model('Admin', AdminSchema);
