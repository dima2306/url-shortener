'use strict';

const { Router } = require('express');
const router = Router();
const ProfileController = require('../controllers/ProfileController');

router.get('/', ProfileController.index);

module.exports = router;