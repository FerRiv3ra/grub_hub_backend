const { response } = require('express');

const User = require('../models/user');

const getUsers = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  if (Number(limit) === isNaN) limit = 5;
  if (Number(from) === isNaN) from = 0;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users: users.reverse(),
  });
};

const getUser = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.json(user);
};

const postUsers = async (req, res = response) => {
  const {
    address = '',
    child,
    dob,
    firstName,
    housingProvider = '',
    lastName,
    noHousehold = 1,
    pensioner,
    phone,
    postcode,
    town = '',
  } = req.body;

  let { childCant = 0 } = req.body;

  let customerId = await User.countDocuments();

  customerId += 1;

  if (!child) {
    childCant = 0;
  }

  const user = new User({
    address,
    child,
    childCant,
    customerId,
    dob,
    firstName,
    housingProvider,
    lastName,
    noHousehold,
    pensioner,
    phone,
    postcode,
    town,
  });

  await user.save();

  res.json(user);
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...body } = req.body;

  const user = await User.findByIdAndUpdate(id, body, {
    returnOriginal: false,
  });

  res.json(user);
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndRemove(id);

  res.json(user);
};

module.exports = {
  getUsers,
  getUser,
  postUsers,
  putUsers,
  deleteUsers,
};
