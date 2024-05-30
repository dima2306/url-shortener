require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

// Listen to requests
app.listen(3000);
// Register view engine
app.set('view engine', 'ejs');
// Middleware & static files
app.use(express.static('public'));
// Register morgan as logger
app.use(morgan('dev'));

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.DB_URI)
    .then(response => console.log('Connected to MongoDB.'))
    .catch(err => console.error(err));

// Base routes
app.get('/', (req, res) => {
    res.render('index');
});