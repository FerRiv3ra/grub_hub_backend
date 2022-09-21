const { Router } = require('express');
const { check } = require('express-validator');
const { postAdmin, putAdmin, deleteAdmin } = require('../controllers/admins');

const { validAdmin } = require('../helpers/db-validators');
const { validateFields, validateJWT, manageRole } = require('../middlewares');

const router = Router();

router.post(
  '/',
  [
    check('firstName', 'The first name cannot be empty').not().isEmpty(),
    check('lastName', 'The last name cannot be empty').not().isEmpty(),
    check('password', 'Is very weak password').isStrongPassword(),
    manageRole,
    validateFields,
  ],
  postAdmin
);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validAdmin),
    validateFields,
  ],
  putAdmin
);

router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validAdmin),
    validateFields,
  ],
  deleteAdmin
);

module.exports = router;
