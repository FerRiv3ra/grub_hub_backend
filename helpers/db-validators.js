const Visit = require('../models/Visit');
const User = require('../models/user');
const Event = require('../models/event');
const Admin = require('../models/Admin');

const validEmail = async (email = '') => {
  if (email !== '') {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new Error(`${email} already registered`);
    }
  }
};

const validUser = async (id) => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`There are not user with ID ${id}`);
  }
};

const validAdmin = async (id) => {
  const existUser = await Admin.findById(id);
  if (!existUser || !existUser.state) {
    throw new Error(`There are not user with ID ${id}`);
  }
};

const validVisit = async (id) => {
  const existVisit = await Visit.findById(id);
  if (!existVisit) {
    throw new Error(`There are not visit with ID ${id}`);
  }
};

const validEvent = async (id) => {
  const existEvent = await Event.findById(id);
  if (!existEvent) {
    throw new Error(`There are not event with ID ${id}`);
  }
};

const validColection = (collection = '', collections = []) => {
  if (!collections.includes(collection)) {
    throw new Error(`${collection} is not valid`);
  }

  return true;
};

module.exports = {
  validUser,
  validVisit,
  validEmail,
  validEvent,
  validColection,
  validAdmin,
};
