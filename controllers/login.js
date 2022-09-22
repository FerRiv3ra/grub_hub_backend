const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const Admin = require('../models/Admin');
const moment = require('moment');

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
        msg: 'User does not exist',
      });
    }

    //Verify password
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        msg: 'User o password no valid',
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Talk to the administrator',
    });
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
};
