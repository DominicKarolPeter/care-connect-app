const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const AdminStatsController = require('../controllers/adminStats.controller');

// GET /api/admin/stats
router.get(
  '/stats',
  authenticate,
  authorizeRole(['admin']),
  AdminStatsController.getAdminStats
);

module.exports = router;
