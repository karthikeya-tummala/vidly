const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 30
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 15
            }
        }), required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minLength: 3,
                maxLength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
            },
        }), required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;