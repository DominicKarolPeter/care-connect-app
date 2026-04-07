const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const pool = require('../config/db');
const AdminController = require('../controllers/admin.controller');

// Get all unapproved caregivers
router.get('/unverified-caregivers', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cp.id, cp.user_id, u.name, u.email, cp.document_url, cp.is_approved
      FROM caregiver_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.is_approved = false
    `);

    res.json({ caregivers: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch caregivers', error: err.message });
  }
});

// Approve a caregiver
router.patch('/approve-caregiver/:id', authenticate, authorizeRole(['admin']), async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE caregiver_profiles SET is_approved = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    res.json({ message: 'Caregiver approved', caregiver: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve caregiver', error: err.message });
  }
});

router.get(
  '/sessions',
  authenticate,
  authorizeRole(['admin']),
  AdminController.getAllSessions
);
module.exports = router;
