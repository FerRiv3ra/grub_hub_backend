const { response } = require('express');

const getUsers = (req, res = response) => {
    res.json({
        msg: 'GET API - Controller'
    });
}

const postUsers = (req, res = response) => {
    res.json({
        msg: 'POST API - Controller'
    });
}

const putUsers = (req, res = response) => {
    res.json({
        msg: 'PUT API - Controller'
    });
}

const deleteUsers = (req, res = response) => {
    res.json({
        msg: 'DELETE API'
    });
}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers
}