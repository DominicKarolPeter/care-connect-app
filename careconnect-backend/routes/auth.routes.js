// Auth routes
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// TEMP placeholder routes for now
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router;
