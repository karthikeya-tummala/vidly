const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.set('view engine', 'pug');

console.log(`Running on "${app.get('env')}" environment`);
console.log("started");

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

app.get('/api/hello', (req, res) => {
    res.send("Hello World");
});

dbDebugger('Connected to the database...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!!!`));

