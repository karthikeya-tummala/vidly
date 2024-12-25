const express = require('express');
const router = express.Router();
const _ = require('lodash');
const argon2 = require('argon2');
const auth = require('../middleware/auth');
const { validate, User } = require('../models/user');
const validateId = require('../utils/validateId');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).send('User records not found');
    res.send(user);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.detail[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User with email already exists');

    const hashedPassword = await argon2.hash(req.body.password, {type: argon2.argon2id});

    user = new User(_.pick(req.body, ['name', 'email']));
    user.password = hashedPassword;
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', auth, async (req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid User ID');

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser) return res.status(404).send('No user with given ID is found');

    res.send(_.pick(deletedUser, ['_id', 'name', 'email']));
});

module.exports = router;