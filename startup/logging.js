const winston = require("winston");
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    winston.rejections.handle(
        new winston.transports.File({ filename: 'uncaughtRejections.log' })
    );

    winston.add(winston.transports.File, {filename: 'logs.log'});
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost:3000/vidly',
        level: 'info'
    });
}