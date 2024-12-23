const Joi = require('Joi');
Joi.objectId = require('joi-objectid') (Joi);

function validateId(id){
    const schema = Joi.objectId();
    const { error } = schema.validate(id);
    return error;
}

module.exports = validateId;