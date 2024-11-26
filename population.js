const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to DB.', err));

const Author = mongoose.model('Author', new mongoose.Schema({
    name: String,
    bio: String,
    website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
}));

async function createAuthor(name, bio, website){
    const author = new Author({
        name,
        bio,
        website
    });

    const result = await author.save();
    console.log(result);
}

async function createCourse(name, author){
    const course = new Course({
        name,
        author
    });
    const result = await course.save();
    console.log(result);
}

async function listCourses(){
    const courses = await Course
        .find()
        .populate('author', 'name -_id')
        .select('name author');
    console.log(courses);
}

async function listAuthors(){
    const authors = await Author
        .find();
    console.log(authors);
}

// createAuthor('Mosh', 'My bio', 'My website');
// createCourse('Node Course');
listCourses();