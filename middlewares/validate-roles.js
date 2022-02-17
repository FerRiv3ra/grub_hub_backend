const { response } = require('express');

const isAdminRole = (req, res = response, next) => {
    if(!req.user){
        return res.status(500).json({
            msg: 'Try to validate role before validate token'
        });
    }
    const { role, name } = req.user;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} is not admin`
        });
    }

    next();
}

module.exports = {
    isAdminRole
}