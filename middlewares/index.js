const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

module.exports = {
    validateFields,
    validateJWT,
    isAdminRole
}