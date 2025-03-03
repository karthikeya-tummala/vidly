const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {validate, Genre} = require('../models/genre');
const validateId = require('../utils/validateId');

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Genre ID');

    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} not found`);
    res.send(genre);
});

router.post('/', auth, async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', [auth, admin], async (req, res) => {
    let errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Genre ID');

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} is not found`);
    res.send(genre);
});

router.delete('/:id', [auth, admin], async(req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Genre ID');

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} is not found!!!`);
    res.send(genre);
});

module.exports = router;