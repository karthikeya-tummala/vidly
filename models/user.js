const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(30),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });

    return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;