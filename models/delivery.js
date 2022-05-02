const { Schema, model } = require('mongoose');

const DeliverySchema = Schema({
  date: {
    type: Date,
    required: true,
  },
  customer_id: {
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = model('Deliverie', DeliverySchema);
