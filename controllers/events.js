const { response } = require('express');
const { deleteEventByID } = require('../helpers');

const Event = require('../models/event');

const getEvents = async (req, res = response) => {
  const { limit = 0, from = 0 } = req.query;
  const today = new Date(new Date().toISOString().slice(0, 10));

  try {
    const [events, pastEvents] = await Promise.all([
      Event.find({ date: { $gte: today } })
        .skip(Number(from))
        .limit(Number(limit))
        .sort({ date: 1 }),
      Event.find({ date: { $lte: today } })
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
    if (pastEvents.length > 0) {
      pastEvents.map(async (e) => {
        await deleteEventByID(e._id);
      });
    }
    res.json({ events });
  } catch (error) {
    console.log(error);
  }
};

const postEvent = async (req, res = response) => {
  const { title, date, img = '' } = req.body;

  const event = new Event({ title, date, img });

  try {
    await event.save();
    res.json(event);
  } catch (error) {
    console.log(error);
  }
};

const putEvent = async (req, res = response) => {
  const { _id, ...body } = req.body;
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(id, body, {
      returnOriginal: false,
    });
    res.json(event);
  } catch (error) {
    console.log(error);
  }
};

const deleteEvent = async (req, res = response) => {
  const { id } = req.params;

  try {
    const event = await deleteEventByID(id);
    res.json(event);
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

module.exports = {
  postEvent,
  getEvents,
  putEvent,
  deleteEvent,
};
