const winston = require('winston');
const {error} = require("winston");

module.exports = function(err, req, res, next){
    //Log the error
    winston.error(err.message, err);

    res.status(500).send('Internal Server Error');
}