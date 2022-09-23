const { Router } = require('express');
const { check } = require('express-validator');
const {
  postAdmin,
  putAdmin,
  deleteAdmin,
  confirmToken,
  newPassword,
  forgotPassword,
} = require('../controllers/admins');

const { validAdmin } = require('../helpers');
const {
  validateFields,
  validateJWT,
  manageRole,
  validateEmailMiddleWare,
  validatePasswordMiddleware,
} = require('../middlewares');

const router = Router();

router.post(
  '/',
  [
    check('name', 'The name cannot be empty').not().isEmpty(),
    check('password', 'Is very weak password').isStrongPassword(),
    manageRole,
    validateFields,
  ],
  postAdmin
);

router
  .route('/forgot-password/:token')
  .get(confirmToken)
  .post(
    [
      check('password', 'Is very weak password').isStrongPassword(),
      validateFields,
    ],
    newPassword
  );

router.post(
  '/forgot-password',
  [check('email', 'Invalid email').isEmail(), validateFields],
  forgotPassword
);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validAdmin),
    validateEmailMiddleWare,
    validatePasswordMiddleware,
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
