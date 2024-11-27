const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateSchema(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
    });

    return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateSchema;