const express = require('express');
const app = express();
const morgan = require('morgan');

// Listen to requests
app.listen(3000);
// Register view engine
app.set('view engine', 'ejs');
// Middleware & static files
app.use(express.static('public'));
// Register morgan as logger
app.use(morgan('dev'));

// Base routes
app.get('/', (req, res) => {
    res.render('index');
});