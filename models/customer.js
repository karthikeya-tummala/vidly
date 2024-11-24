const mongoose = require('mongoose');
const Joi = require('joi');

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

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(5).max(15).required(),
        isGold: Joi.boolean().optional()
    });
    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;