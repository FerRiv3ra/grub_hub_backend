const { Router } = require('express');
const { check } = require('express-validator');
const { createDelivery } = require('../controllers/deliveries');
const { validateJWT, validateFields } = require('../middlewares');

const router = Router();

//GET all deliveries
router.get('/', (req, res) => {
    res.json({msg: 'OK'});
});

//GET one delivery
router.get('/:id', (req, res) => {
    res.json({msg: 'OK'});
});

//Create delivery
router.post('/', [
    validateJWT,
    check('amount', 'The amount is required').not().isEmpty(),
    check('amount', 'The amount have to be a number').isNumeric(),
    check('customer_id', 'The customer ID is required').not().isEmpty(),
    check('customer_id', 'The customer ID have to be a number').isNumeric(),
    validateFields
], createDelivery);

// Edit delivery
router.put('/:id', (req, res) => {
    res.json({msg: 'OK'});
});

// Delete delivery
router.delete('/:id', (req, res) => {
    res.json({msg: 'OK'});
});

module.exports = router;