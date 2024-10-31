require('dotenv').config();

// Vendor requirements
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet'); // Security middleware

// Local requirements
const helpers = require('./helpers/helper');
const UrlController = require('./controllers/UrlController');

const PORT = Number.parseInt(process.env.PORT) || 3000;
const app = express();
const upload = multer();

// Validate required environment variables
if (!process.env.DB_URI || !process.env.APP_SESSION_SECRET) {
  console.error(
      'Missing required environment variables: DB_URI, APP_SESSION_SECRET',
  );
  process.exit(1); // Exit the process with failure
}

app.set('view engine', 'ejs'); // Register view engine
app.use(express.static('public')); // Middleware & static files
app.use(morgan('dev')); // Register morgan as logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies

if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Enhance security with helmet
}

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
app.post('/create', upload.none(), UrlController.store);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: 'Something went wrong!'});
});