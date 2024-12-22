const express = require('express');
const router = express.Router();
const { validate, User } = require('../models/user');

router.get('/', async (req, res) => {
    const users = await User.find().sort();
    if(!users) return res.status(404).send('No users in the database');
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('No user found for the given ID');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.detail[0].message);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    user = user.save();
    res.send(user);
});



