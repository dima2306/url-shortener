'use strict';

const {Router} = require('express');
const blogController = require('../controllers/BlogController');

const router = Router();

router.get('/', blogController.index);
router.get('/:slug', blogController.show);

module.exports = router;
