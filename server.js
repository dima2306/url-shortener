require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet'); // Security middleware

const PORT = Number.parseInt(process.env.PORT) || 3000;
const app = express();
const upload = multer();

const URL = require('./models/Url');
const shortenUrlService = require('./services/ShortenUrlService');
const helpers = require('./helpers/helper');

// Validate required environment variables
if (!process.env.DB_URI || !process.env.APP_SESSION_SECRET) {
  console.error('Missing required environment variables: DB_URI, APP_SESSION_SECRET');
  process.exit(1); // Exit the process with failure
}

app.set('view engine', 'ejs'); // Register view engine
app.use(express.static('public')); // Middleware & static files
app.use(morgan('dev')); // Register morgan as logger
app.use(helmet()); // Enhance security with helmet
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

app.locals.helpers = helpers;

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
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to MongoDB.');
  // Listen to requests
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
}).catch(err => {
  console.error(err);
  process.exit(1); // Exit on connection error
});

// Base routes
app.get('/', (req, res) => {
  res.render('index', {
    messages: req.flash('messageBag'),
  });
});

// upload.none() is a middleware function that processes the FormData but does not handle any files.
// The processed data is stored in req.body.
app.post('/create', upload.none(), async (req, res) => {
  const {originalUrl, expiration, visibility} = req.body;

  // Helper function to render flash messages
  const renderFlashMessage = (messageBag, statusCode) => {
    req.flash('messageBag', messageBag);
    return new Promise((resolve, reject) => {
      ejs.renderFile('views/_partials/flash_message.ejs', {
        messages: req.flash('messageBag'),
        helpers: app.locals.helpers,
      }, (err, str) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve({type: 'error', data: str});
      });
    });
  };

  try {
    if (helpers.isObjectEmpty(req.body)) {
      const errorMessage = [
        {
          type: 'error',
          message: 'Request is empty. Please fill the required fields.',
        },
      ];
      const response = await renderFlashMessage(errorMessage, 400);
      return res.status(400).json(response);
    }

    if (!originalUrl) {
      const errorMessage = [
        {
          type: 'error',
          message: 'Original URL is required.',
        },
      ];
      const response = await renderFlashMessage(errorMessage, 400);
      return res.status(400).json(response);
    }

    const shortenedUrl = await shortenUrlService.shortenUrl(originalUrl);
    const urlData = {
      originalUrl,
      shortenedUrl,
      expiration: expiration ? new Date(expiration) : null,
      visibility: visibility === 'on',
    };

    const url = new URL(urlData);
    const savedUrl = await url.save();
    return res.status(201).json(savedUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).
        json({type: 'error', message: 'Internal Server Error'});
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: 'Something went wrong!'});
});