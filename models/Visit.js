const { Schema, model } = require('mongoose');

const VisitSchema = Schema({
  amount: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  customerId: {
    type: Number,
    required: [true, 'The customer ID is required'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: String,
    required: true,
  },
});

module.exports = model('Visit', VisitSchema);
