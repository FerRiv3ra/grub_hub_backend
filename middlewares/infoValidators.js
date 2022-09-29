const moment = require('moment');

const validateEmailMiddleWare = (req, res, next) => {
  const { email } = req.body;

  if (email && !email.includes('@thevinecentre.org.uk')) {
    return res.status(400).json({ msg: `${email} is not valid` });
  }

  next();
};

const validatePasswordMiddleware = (req, res, next) => {
  const { password } = req.body;

  const regexStrong = new RegExp(
    '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'
  );

  if (password && !regexStrong.test(password)) {
    return res.status(400).json({ msg: 'Is very week password' });
  }

  next();
};

const validateDOB = (req, res, next) => {
  const { dob } = req.body;

  const date = moment(dob, 'DD/MM/YYYY', true);

  if (!date.isValid()) {
    return res
      .status(400)
      .json({ msg: 'Invalid format - please follow this format (DD/MM/YYYY)' });
  }

  req.body.dob = `${dob}T00:00:00.000Z`;
  next();
};

module.exports = {
  validateEmailMiddleWare,
  validatePasswordMiddleware,
  validateDOB,
};
