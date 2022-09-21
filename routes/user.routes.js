const { Router } = require('express');
const { check } = require('express-validator');

const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  getUser,
} = require('../controllers/users');
const { validUser } = require('../helpers/db-validators');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.get('/', getUsers);

router.get(
  '/:id',
  [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validUser),
    validateFields,
  ],
  getUser
);

router.post(
  '/',
  [
    check('address', 'The address cannot be empty').not().isEmpty(),
    check('firstName', 'The first name cannot be empty').not().isEmpty(),
    check('lastName', 'The last name cannot be empty').not().isEmpty(),
    check('postcode', 'Is not valid postcode').isPostalCode('GB'),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('dob', 'Date of birth is not valid').isDate({ format: 'DD/MM/YYYY' }),
    validateFields,
  ],
  postUsers
);

router.put(
  '/:id',
  [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validUser),
    validateFields,
  ],
  putUsers
);

router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validUser),
    validateFields,
  ],
  deleteUsers
);

module.exports = router;
