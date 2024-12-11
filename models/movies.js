const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('/genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 255
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0
    }
}));

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(255),
        genre: Joi.string().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().required().min(0)
    });

    return schema.validate(movie);
}

exports.validate = validateMovie;
exports.Movie = Movie;