const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    authors: [authorSchema]
}));

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId);
    if (!course) {
        console.error('Course not found');
        return;
    }

    course.authors.push(author);
    course.save();
    console.log('Author added');
}

async function removeAuthor(courseId, authorId){
    const course = await Course.findById(courseId);
    course.authors.pull({ _id: authorId });
    course.save();
}

// createCourse('Node Course',[
//     new Author({name: 'Mosh'}),
//     new Author({name: 'Karthikeya'})
// ]);

removeAuthor('67471e22a20017e665c11050', '6747202e26f5e1bd24017b80');
