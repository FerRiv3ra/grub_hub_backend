const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('Sorry the token cannot be generate');
            }else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}