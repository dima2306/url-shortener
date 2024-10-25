require('dotenv').config();

const express = require('express');
const PORT = Number.parseInt(process.env.PORT) || 3000;
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const flash = require('connect-flash');

const URL = require('./models/Url');
const shortenUrlService = require('./services/ShortenUrlService');
const helpers = require('./helpers/helper')

// Register view engine
app.set('view engine', 'ejs');
// Middleware & static files
app.use(express.static('public'));
// Register morgan as logger
app.use(morgan('dev'));

app.locals.helpers = helpers;

// app.use(express.urlencoded({ extended: true }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.APP_SESSION_SECRET,
    // cookie: {
    //     secure: true,
    //     maxAge: 60000,
    //     expires: new Date(Date.now() + 60000),
    // },
}));
app.use(flash());

// Connect to MongoDB
console.log('Connecting to MongoDB...')
mongoose.connect(process.env.DB_URI).then(() => {
    console.log('Connected to MongoDB.')
    // Listen to requests
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
}).catch(err => console.error(err))

// Base routes
app.get('/', (req, res) => {
    res.render('index', {
        messages: req.flash('messageBag'),
    });
});

// upload.none() is a middleware function that processes the FormData but does not handle any files.
// The processed data is stored in req.body.
app.post('/create', upload.none(), async (req, res) => {
    if (helpers.isObjectEmpty(req.body)) {
        res.status(400).json({
            data: {
                type: 'error',
                message: 'Request is empty. Please fill the required fields.',
            },
        })
    }

    if (req.body.originalUrl === '') {
        res.status(400).json({ data: { type: 'error', message: 'Original URL is required.' } })
    }

    let originalUrl = req.body.originalUrl;
    let shortenedUrl = await shortenUrlService.shortenUrl(originalUrl);
    let expiration = new Date(req.body.expiration) || null;
    let visibility = req.body.visibility === 'on';

    const url = new URL({
        originalUrl: originalUrl,
        shortenedUrl: shortenedUrl,
        expiration: expiration,
        visibility: visibility,
    });

    url.save()
        .then(response => res.status(201).send(response))
        .catch(err => console.error(err));
});