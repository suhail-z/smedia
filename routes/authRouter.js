const express = require('express');
const { authControl } = require('../controllers/authController');
const router = express.Router();

router.post('/signup',authControl);

module.exports = router;