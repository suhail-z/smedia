const express = require('express');
const {  signupSchema, loginSchema, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup',signupSchema);

router.post('/login',loginSchema);

router.post('/logout',logout);

module.exports = router;