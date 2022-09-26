const { response } = require('express');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');
const generateID = require('../helpers/generateID');
const sendEmail = require('../helpers/sendEmail');

const postAdmin = async (req, res = response) => {
  const { email, name, password } = req.body;

  const salt = bcrypt.genSaltSync();
  const existsUser = await Admin.findOne({ email });

  if (existsUser && !existsUser.state) {
    existsUser.name = name;
    existsUser.password = bcrypt.hashSync(password, salt);
    existsUser.state = true;

    await existsUser.save();

    return res.json({ ok: true, user: existsUser });
  }

  if (existsUser && existsUser.state) {
    return res.status(400).json({ ok: false, msg: 'User already registered' });
  }

  const user = new Admin({
    email: email.toLowerCase(),
    name,
    password,
  });

  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  res.json({ ok: true, user });
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

  res.json({ ok: true, user });
};

const deleteAdmin = async (req, res = response) => {
  const { id } = req.params;

  const user = await Admin.findByIdAndUpdate(id, { state: false });

  res.json({ ok: true, user });
};

const forgotPassword = async (req, res = response) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Unregistered email', ok: false });
    }

    const token = generateID();
    user.token = token;
    await user.save();

    const sent = await sendEmail(email, user.firstName, token, true);

    if (sent) {
      return res.json({
        msg: sent.msg,
        ok: true,
      });
    } else {
      return res
        .status(500)
        .json({ ok: false, msg: 'email no sent, talk to the administrator' });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, msg: 'email no sent, talk to the administrator' });
  }
};

const confirmToken = async (req, res = response) => {
  const { token } = req.params;

  try {
    const user = await Admin.findOne({ token });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token', ok: false });
    }

    res.json({ msg: 'Valid token', ok: true });
  } catch (error) {
    res.status(400).json({ msg: 'Invalid token', ok: false });
  }
};

const newPassword = async (req, res = response) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await Admin.findOne({ token });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token', ok: false });
    }

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    user.token = '';

    await user.save();

    res.json({ msg: 'Password updated', ok: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postAdmin,
  putAdmin,
  deleteAdmin,
  forgotPassword,
  confirmToken,
  newPassword,
};
