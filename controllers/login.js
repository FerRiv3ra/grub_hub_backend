const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        //Verify if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                msg: 'User o password no valid'
            });
        }

        //Verify user state
        if(!user.state){
            return res.status(400).json({
                msg: 'User o password no valid'
            });
        }

        //Verify password
        const validPass = bcryptjs.compareSync(password, user.password);
        if(!validPass){
            return res.status(400).json({
                msg: 'User o password no valid'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Talk to the administrator'
        });
    }
}

module.exports = {
    login
};