const { Router } = require('express');
const { check } = require('express-validator');

const { getUsers, postUsers, putUsers, deleteUsers, getUser } = require('../controllers/users');
const { validRole, validUser } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getUsers);

router.get('/:id',[
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( validUser ),
    validateFields
], getUser);

router.post('/', [
    check('name', 'The name cannot be empty').not().isEmpty(),
    check('password', 'Min password is 6 chars').isLength({min: 6}),
    check('postcode', 'Is not valid postcode').isPostalCode('GB'),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('dob', 'Date of birth is not valid').isDate({format: 'DD-MM-YYYY'}),
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
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( validUser ),
    validateFields
] , deleteUsers);

module.exports = router;