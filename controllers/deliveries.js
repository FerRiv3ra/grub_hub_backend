const { unlinkSync } = require('fs');
const { response } = require('express');
const createPDF = require('../helpers/createPDF');
const nodemailer = require('nodemailer');

const { initialDate, converToDate } = require('../helpers/get-dates');
const Visit = require('../models/Visit');
const User = require('../models/user');
const emailHTML = require('../helpers/html-email');
const createXLSX = require('../helpers/createXLSX');
const moment = require('moment');

const createDelivery = async (req, res = response) => {
  const { customerId, uid, amount = 0 } = req.body;

  const date = moment();

  const startDate = initialDate();

  const data = {
    amount,
    customerId,
    date,
    startDate,
  };

  const existsVisit = await Visit.find({ customerId, startDate });

  if (existsVisit[0]) {
    return res.status(401).json({
      msg: 'This customer ID is alredy used this week',
    });
  }

  const user = await User.findById(uid);

  user.visits = user.visits + 1;
  user.lastVisit = moment().format('DD/MM/YYYY');

  if (user.visits % 4 === 0) {
    user.blocked = true;
  }

  await user.save();

  const visit = new Visit(data);

  await visit.save();

  res.status(201).json({ ok: true, visit });
};

const getAllDeliveries = async (req, res = response) => {
  const today = new Date();
  const { startDate = '01/09/2022', finalDate = today } = req.query;
  let final;

  const start = converToDate(startDate);
  if (typeof finalDate === 'string') {
    final = converToDate(finalDate, 'final');
  } else {
    final = finalDate;
  }

  if (start > today || start > final) {
    return res.status(400).json({
      msg: 'The dates are not valid',
    });
  }

  if (final > today) {
    final = today;
  }

  const visits = await Visit.find({
    $and: [
      { date: { $gte: new Date(start), $lte: new Date(final) } },
      { state: true },
    ],
  });

  if (!visits) {
    return res.status(204).json({
      msg: 'Nothing to show',
    });
  }

  const users = await User.find();

  const usersData = visits.map((del) => {
    for (const user of users) {
      if (user.customerId === del.customerId) {
        user.visits = 0;
        return user;
      }
    }
  });

  const usersArr = usersData
    .reduce((temp, user) => {
      temp[user.customerId] = user;
      temp[user.customerId].visits += 1;
      return temp;
    }, [])
    .filter((temp) => temp !== null);

  res.json({ visits, usersArr });
};

const sendEmail = async (req, res = response) => {
  const today = new Date();
  const { startDate = '01/09/2022', finalDate = today } = req.body;
  let final;

  const start = converToDate(startDate);
  if (typeof finalDate === 'string') {
    final = converToDate(finalDate, 'final');
  } else {
    final = finalDate;
  }

  if (start > today || start > final) {
    return res.status(400).json({
      msg: 'The dates are not valid',
    });
  }

  if (final > today) {
    final = today;
  }

  const visits = await Visit.find({
    $and: [
      { date: { $gte: new Date(start), $lte: new Date(final) } },
      { state: true },
    ],
  });

  if (!visits) {
    return res.status(204).json({
      msg: 'Nothing to show',
    });
  }

  const users = await User.find();

  const usersData = visits.map((visit) => {
    for (const user of users) {
      if (user.customerId === visit.customerId) {
        user.visits = 0;
        return user;
      }
    }
  });

  const usersArr = usersData
    .reduce((temp, user) => {
      temp[user.customerId] = user;
      temp[user.customerId].visits += 1;
      return temp;
    }, [])
    .filter((temp) => temp !== null);

  const email = req.user.email;

  const totalHousehold = usersArr.reduce((tot, item) => {
    return tot + item.noHousehold;
  }, 0);

  const response = await createPDF(
    start,
    final,
    usersArr,
    visits,
    totalHousehold
  );

  const excel = await createXLSX(final, usersArr, visits, totalHousehold);

  if (response.ok && excel.ok) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.PORT_EMAIL,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASS_EMAIL,
        },
      });

      await transport.sendMail({
        from: '"No-Reply The Vine Centre" <no-reply@thevinecentre.org.uk>',
        to: email,
        subject: `Report ${start.toISOString().slice(0, 10)} - ${final
          .toISOString()
          .slice(0, 10)}`, // Subject line
        html: emailHTML,
        attachments: [
          {
            filename: `report${final.toISOString().slice(0, 10)}.pdf`,
            path: `./uploads/report${final.toISOString().slice(0, 10)}.pdf`,
            contentType: 'application/pdf',
          },
          {
            filename: `report${final.toISOString().slice(0, 10)}.xlsx`,
            path: `./uploads/report${final.toISOString().slice(0, 10)}.xlsx`,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      });

      unlinkSync(`./uploads/report${final.toISOString().slice(0, 10)}.pdf`);
      unlinkSync(`./uploads/report${final.toISOString().slice(0, 10)}.xlsx`);

      return res.json({ msg: `Email sent to ${email}` });
    } catch (error) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
  } else {
    return res.status(408).json(response);
  }
};

const getDelivery = async (req, res = response) => {
  const { id } = req.params;
  const startDate = initialDate();

  const delivery = await Visit.find({ customerId: id, startDate });

  if (delivery.length !== 0) {
    return res.status(401).json({
      msg: 'This customer ID is alredy used this week',
    });
  }

  res.status(200).json({
    ok: true,
  });
};

const putDelivery = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...body } = req.body;

  const delivery = await Visit.findByIdAndUpdate(id, body);

  res.json(delivery);
};

const deleteDelivery = async (req, res = response) => {
  const { id } = req.params;

  const delivery = await Visit.findByIdAndUpdate(id, { state: false });

  res.json(delivery);
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDelivery,
  putDelivery,
  deleteDelivery,
  sendEmail,
};
