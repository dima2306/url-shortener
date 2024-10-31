const express = require('express');
const UrlController = require('../controllers/UrlController');
const multer = require('multer');
const router = express.Router();
const upload = multer();

// upload.none() is a middleware function that processes the FormData but does not handle any files.
// The processed data is stored in req.body.
router.post('/create', upload.none(), UrlController.store);

module.exports = router;
