'use strict';

const { Router } = require('express');
const router = Router();
const multer = require('multer');

const UrlController = require('../controllers/UrlController');
const upload = multer();

// upload.none() is a middleware function that processes the FormData but does not handle any files.
// The processed data is stored in req.body.
router.post('/create', upload.none(), UrlController.store);

router.get('/redirect/:shortUrl', UrlController.redirect);

module.exports = router;
