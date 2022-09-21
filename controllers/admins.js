const { response } = require('express');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

const postAdmin = async (req, res = response) => {
  const { email, firstName, lastName, password } = req.body;

  const user = new Admin({
    email: email.toLowerCase(),
    firstName,
    lastName,
    password,
  });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  res.json(user);
};

const putAdmin = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, email, ...body } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync();
    body.password = bcrypt.hashSync(password, salt);
  }

  if (email) {
    body.email = email.toLowerCase();
  }

  const user = await Admin.findByIdAndUpdate(id, body, {
    returnOriginal: false,
  });

  res.json(user);
};

const deleteAdmin = async (req, res = response) => {
  const { id } = req.params;

  const user = await Admin.findByIdAndUpdate(id, { state: false });

  res.json(user);
};

module.exports = {
  postAdmin,
  putAdmin,
  deleteAdmin,
};
