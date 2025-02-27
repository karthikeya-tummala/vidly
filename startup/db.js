import mongoose from "mongoose";
import winston from "winston";

module.exports = function (){
    mongoose.connect('mongodb://localhost/vidly')
        .then(() => winston.info('Connected to MongoDB'));
}
