const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

mongoose.connect('mongodb://localhost/vidly/customers')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error:', err));

mongoose.connection.on('connected', () => {
    console.log(`Connected to Database ${mongoose.connection.name}`);
});

const Customer = mongoose.model('Customer', new mongoose.Schema ({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 15
    }
}));

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validateData(req.body);
    if(error) {return res.status(404).send(error.details[0].message)}

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });

    customer = await customer.save();
    res.send(customer);
});

function validateData(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(5).max(15).required(),
    });
    return schema.validate(customer);
}

module.exports = router;