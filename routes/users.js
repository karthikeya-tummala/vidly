const express = require('express');
const router = express.Router();
const _ = require('lodash');
const argon2 = require('argon2');
const { validate, User } = require('../models/user');
const validateId = require('../utils/validateId');

router.get('/', async (req, res) => {
    const users = await User.find().sort();
    if(!users) return res.status(404).send('No users in the database');
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid User ID');

    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('No user found for the given ID');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.detail[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User with email already exists');

    const hashedPassword = await argon2.hash(req.body.password, {type: argon2.argon2id});

    user = new User(_.pick(req.body, ['name', 'email']));
    user.password = hashedPassword;
    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', async (req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid User ID');

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser) return res.status(404).send('No user with given ID is found');

    res.send(_.pick(deletedUser, ['_id', 'name', 'email']));
});

module.exports = router;