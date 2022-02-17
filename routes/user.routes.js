const { Router } = require('express');
const { check } = require('express-validator');

const { getUsers, postUsers, putUsers, deleteUsers } = require('../controllers/users');
const { validRole, validUser } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', getUsers);

router.post('/', [
    check('name', 'The name cannot be empty').not().isEmpty(),
    check('password', 'Min password is 6 chars').isLength({min: 6}),
    check('postcode', 'Is not valid postcode').isPostalCode('GB'),
    // check('role', 'Is not valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( validRole ),
    validateFields
] , postUsers);

router.put('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( validUser ),
    check('role').custom( validRole ),
    validateFields
] , putUsers);

router.delete('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( validUser ),
    validateFields
] , deleteUsers);

module.exports = router;