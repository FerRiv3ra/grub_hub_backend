const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const Admin = require('../models/Admin');
const sendEmail = require('../helpers/sendEmail');
const generateID = require('../helpers/generateID');

const login = async (req, res = response) => {
  const { password } = req.body;
  let { email } = req.body;

  email = email.toLowerCase();

  try {
    //Verify if user exists
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    //Verify user state
    if (!user.state) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exist',
      });
    }

    //Verify password
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: 'User o password no valid',
      });
    }

    const token = generateID();
    user.token = token;
    await user.save();

    const resp = await sendEmail(email, user.firstName, token);

    res.json({ ok: true, msg: resp.msg });
  } catch (error) {
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

const confirmTokenLongin = async (req, res = response) => {
  const { id } = req.params;

  try {
    const user = await Admin.findOne({ token: id });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token', ok: false });
    }

    user.token = '';
    await user.save();

    const token = await generateJWT(user.id);

    res.json({ ok: true, user, token });
  } catch (error) {
    console.log(error);
  }
};

const loginByToken = (req, res) => {
  const { user } = req;

  res.json({ user });
};

const loginUser = async (req, res = response) => {
  const { customerId, dob } = req.body;

  try {
    const user = await User.findOne({ customerId });

    if (!user) {
      return res.status(400).json({
        msg: 'User does not exist',
      });
    }

    if (dob !== user.dob) {
      return res.status(400).json({
        msg: 'Customer ID o date of birth no valid',
      });
    }

    res.json({ ok: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
  }
};

module.exports = {
  login,
  loginUser,
  loginByToken,
  confirmTokenLongin,
};
