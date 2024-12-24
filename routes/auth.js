const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    try{
        const isMatch = await argon2.verify(user.password, req.body.password);
        if(!isMatch) return res.status(400).send('Invalid email or password');

        const token = jwt.sign({_id: user._id}, 'testSecretKey');
        res.send(token);

    } catch (err) {
        console.error('Error verifying password:', err);
        res.status(500).send('Internal server error');
    }
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });
    return schema.validate(req);
}

module.exports = router;
