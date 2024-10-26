const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(logger);

const genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Comedy'},
    {id: 3, name: 'Thriller'},
]

app.get('/', (req, res) => {
   res.send('Welcome to Vidly!!!');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} not found`);

    res.send(genre);
});

app.post('/api/genres', (req, res) => {

    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error);

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    }

    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send(`Course with id ${req.params.id} is not found`);

    const { error } = validateSchema(req.body);

    if(error) return res.status(400).send(error);

    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
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

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`Listening of port ${port}!!!`) });