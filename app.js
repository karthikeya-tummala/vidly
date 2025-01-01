require('express-async-errors');
const winston = require('winston');
require('winston-mongodb')
const error = require('./middleware/error');
const genres = require('./routes/genres');
const home = require('./routes/home');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');
const express = require('express');
const mongoose = require("mongoose");
const app = express();

winston.handleExceptions(
    new winston.transports.File({filename: 'unhandledExceptions.log'}));

process.on('unhandledRejection', (ex) => {
    throw ex;
});

winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {
    dbName: 'mongodb://localhost:3000/vidly',
    level: info
});

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
    .catch(err => console.log('Error:', err));

mongoose.connection.on('connected', () => {
    console.log(`Connected to Database ${mongoose.connection.name}`);
});

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening of port ${port}!!!`) });