// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route to register a new user
// POST /api/auth/register
router.post('/register', registerUser);

// Route to login an existing user
// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
