const express = require('express');
const app = express();

// Listen to requests
app.listen(3000);
// Register view engine
app.set('view engine', 'ejs');

// Base routes
app.get('/', (req, res) => {
    res.render('index');
});