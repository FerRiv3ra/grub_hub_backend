const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginUser } = require('../controllers/login');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login);

router.post('/login-user', [
    check('customer_id', 'Customer ID is required').not().isEmpty(),
    check('customer_id', 'Have to be a number').isNumeric(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    validateFields
], loginUser);

module.exports = router;