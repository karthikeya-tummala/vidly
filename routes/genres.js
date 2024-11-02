const express = require('express');
const Joi = require("joi");
const router = express.Router();

const genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Comedy'},
    {id: 3, name: 'Thriller'},
]

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} not found`);

    res.send(genre);
});

router.post('/', (req, res) => {

    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error);

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    }

    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send(`Course with id ${req.params.id} is not found`);

    const { error } = validateSchema(req.body);

    if(error) return res.status(400).send(error);

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} is not found!!!`);

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

function validateSchema(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(genre);
}

module.exports = router;