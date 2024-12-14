require('dotenv').config();

// Vendor requirements
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet'); // Security middleware
const cookieParser = require('cookie-parser');

// Local requirements
const helpers = require('./helpers/helper');
const urlRoutes = require('./routes/urlRoutes');
const authRoutes = require('./routes/authRoutes');

const PORT = Number.parseInt(process.env.PORT) || 3000;
const app = express();

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
app.use(cookieParser()); // Parse cookies

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
  res.render('layout', {
    content: 'index',
    messages: req.flash('messageBag'),
  });
});

app.get('/terms-and-conditions', (req, res) => {
  res.render('layout', {
    content: 'terms_conditions',
  });
});

app.get('/set-cookies', (req, res) => {
  res.cookie('guest', true, {
    maxAge: 60000,
    expires: new Date(Date.now() + 60000),
    // httpOnly: true,
  }).send('cookie set');
});

app.get('/get-cookies', (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);

  res.json(cookies);
});

app.use('/url', urlRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: 'Something went wrong!'});
});