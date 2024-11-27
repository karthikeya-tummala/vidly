const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error:', err));

const Genre = mongoose.model()

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
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie){
    const schema = {
        title: Joi.string().required().min(3).max(255),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255)
    }
}