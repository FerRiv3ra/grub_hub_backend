const { Schema, model } = require("mongoose");

const EventSchema = Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "The title is required"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  img: {
    type: String,
  },
});

module.exports = model("Event", EventSchema);
