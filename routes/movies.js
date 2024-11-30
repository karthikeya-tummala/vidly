const { Movie, validate } = require('../models/movies');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort('name');
        if(!movies) return res.status(404).send('No movies found');
        res.send(movies);
    }
    catch(err) {
        return res.status(500).send('Error while fetching movies');
    }
});

router.get('/:id', async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).send(`Movie with id ${req.params.id} is not found.`);
        res.send(movie);
    }
    catch (err){
        return res.status(500).send(`Error occurred while fetching movie with id ${req.params.id}.`);
    }
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre.');
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

module.exports = router;