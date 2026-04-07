const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const CaregiverController = require('../controllers/caregiver.controller');

// Publicly fetch all approved caregivers
router.get('/caregivers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
    cp.id AS caregiver_profile_id,
    u.name, 
    u.email,
    cp.specialties, 
    cp.experience_years, 
    cp.availability,
    COALESCE(AVG(r.rating), 0)::numeric(2,1) AS average_rating,
    COUNT(r.id) AS rating_count
  FROM caregiver_profiles cp
  JOIN users u ON cp.user_id = u.id
  LEFT JOIN ratings r ON cp.user_id = r.caregiver_id
  WHERE cp.is_approved = true
  GROUP BY cp.id, u.name, u.email, cp.specialties, cp.experience_years, cp.availability
    `);

    res.json({ caregivers: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch caregivers', error: err.message });
  }
});
// 🚩 Get real-time caregiver location (by CareReceiver)
router.get(
  '/caregiver-location/:caregiverId',
  authenticate,
  authorizeRole(['carereceiver','admin']),
  CaregiverController.getCaregiverLocation
);


module.exports = router;
