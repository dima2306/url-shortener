require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const URL = require('./models/Url');
const shortenUrlService = require('./services/ShortenUrlService');
const helpers = require('./helpers/helper')

const port = process.env.PORT || 3000;

// Register view engine
app.set('view engine', 'ejs');
// Middleware & static files
app.use(express.static('public'));
// Register morgan as logger
app.use(morgan('dev'));

// Connect to MongoDB
console.log('Connecting to MongoDB...')
mongoose.connect(process.env.DB_URI).then(() => {
    console.log('Connected to MongoDB.')
    // Listen to requests
    app.listen(port, () => console.log(`Server is running on port ${port}.`))
}).catch(err => console.error(err))

// Base routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', async (req, res) => {
    if (helpers.isObjectEmpty(req.query)) {
        res.status(400).json({data: {type: 'error', message: 'Request is empty. Please fill the required fields.'}});
    }

    const url = new URL({
        originalUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
        shortenedUrl: await shortenUrlService.shortenUrl(req.originalUrl),
    });

    url.save()
        .then(response => res.status(201).send(response))
        .catch(err => console.error(err));
});