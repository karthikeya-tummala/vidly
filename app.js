const genres = require('./routes/genres');
const home = require('./routes/home');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/genres', genres);
app.use('/', home);
app.use(logger);

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`Listening of port ${port}!!!`) });