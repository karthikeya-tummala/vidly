const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${mongoose.connection.name}`);
});

const Genre = mongoose.model('genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    }
}));

router.get('/', async (req, res) => {
    res.send(await Genre.find().sort('name'));
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} not found`);
    res.send(genre);
});

router.post('/', async (req, res) => {
    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateSchema(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} is not found`);
    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} is not found!!!`);
    res.send(genre);
});

function validateSchema(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
    });

    return schema.validate(genre);
}

module.exports = router;