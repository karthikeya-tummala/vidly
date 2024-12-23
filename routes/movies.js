const express = require('express');
const { validate, Movie } = require('../models/movie');
const router = express.Router();
const { Genre } = require('../models/genre');
const validateId = require('../utils/validateId');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.get('/:id', async(req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Movie ID');

    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Movie not found with given Id');
    res.send(movie);
});

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId).select('name');
    if(!genre) return res.status(404).send('Genre doesn\'t exist');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);
});

router.put('/:id', async(req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Movie ID');

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Genre doesn\'t exist');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
    {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    if(!movie) return res.status(404).send('Movie not found with given Id');

    res.send(movie);
});

router.delete('/:id', async(req, res) => {
    const errorId = validateId(req.params.id);
    if(errorId) return res.status(400).send('Invalid Movie ID');

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('Movie not found with given Id');
    res.send(movie);
});

module.exports = router;