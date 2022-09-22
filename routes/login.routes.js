const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginUser, loginByToken } = require('../controllers/login');
const { validateDOB } = require('../middlewares/infoValidators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email is not valid').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,
  ],
  login
);

router.get('/login', validateJWT, loginByToken);

router.post(
  '/login-user',
  [
    check('customerId', 'Customer ID is required').not().isEmpty(),
    check('customerId', 'Have to be a number').isNumeric(),
    validateDOB,
    validateFields,
  ],
  loginUser
);

module.exports = router;
