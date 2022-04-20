const { response } = require("express");

const Event = require("../models/event");

const getEvents = async (req, res = response) => {
  const { limit = 0, from = 0 } = req.query;

  try {
    const events = await Event.find().skip(Number(from)).limit(Number(limit));
    res.json({ events });
  } catch (error) {
    console.log(error);
  }
};

const postEvent = async (req, res = response) => {
  const { title, date, img = "" } = req.body;

  const event = new Event({ title, date, img });

  try {
    await event.save();
    res.json({ event });
  } catch (error) {
    console.log(error);
  }

  res.json({ msg: "Post Event" });
};

const putEvent = async (req, res = response) => {
  const { _id, ...body } = req.body;
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(id, body);
    res.json(event);
  } catch (error) {
    console.log(error);
  }
};

const deleteEvent = async (req, res = response) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndRemove(id);
    res.json(event);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postEvent,
  getEvents,
  putEvent,
  deleteEvent,
};
