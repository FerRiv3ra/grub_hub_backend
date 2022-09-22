const nodemailer = require('nodemailer');
const signInAndForgotHTML = require('./signInAndForgotHTML');

const sendEmail = async (email, name, token = '', changePass = false) => {
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
      from: 'No-Reply <no-reply@thevinecentre.org.uk>',
      to: email,
      subject: changePass
        ? `Forgot password <${email}>`
        : `2-Step Verification <${email}>`, // Subject line
      html: signInAndForgotHTML(name, token, changePass),
    });

    return { msg: `Email sent to ${email}` };
  } catch (error) {
    return { error: 'Invalid email' };
  }
};

module.exports = sendEmail;
