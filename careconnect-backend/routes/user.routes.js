const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const UserController = require('../controllers/user.controller'); // ✅ Add this

// 🟢 Setup route for Firebase users
router.post('/setup', UserController.setupUser); // ❌ NO auth middleware here

// 🔐 Protected route for caregivers only
router.get(
  '/caregiver/dashboard',
  authenticate,
  authorizeRole(['caregiver']),
  (req, res) => {
    res.json({
      message: 'Welcome caregiver!',
      user: req.localUser
    });
  }
);

module.exports = router;
