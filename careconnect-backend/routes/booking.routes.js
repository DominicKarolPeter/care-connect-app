// routes/booking.routes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const BookingController = require('../controllers/booking.controller');
const chargeUtil = require('../utils/chargeCalculator');
const pool = require('../config/db'); // ✅ PostgreSQL connection

router.post(
  '/estimate',
  authenticate,
  authorizeRole(['carereceiver']),
  async (req, res) => {
    const { caregiver_id, time_slot } = req.body;

    try {
      const result = await pool.query(
        'SELECT experience_years FROM caregiver_profiles WHERE user_id = $1 AND is_approved = true AND is_online = true',
        [caregiver_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Caregiver not available or not approved' });
      }

      const experience_years = result.rows[0].experience_years;
      const charge = chargeUtil.calculateCharges(experience_years, time_slot);

      res.json({ estimated_charge: charge });
    } catch (err) {
      res.status(500).json({ message: 'Failed to estimate charge', error: err.message });
    }
  }
);
// POST: Care receiver sends a booking request
router.post(
  '/request',
  authenticate,
  authorizeRole(['carereceiver']),
  BookingController.createBooking
);

// GET: Caregiver views received booking requests
router.get(
  '/received',
  authenticate,
  authorizeRole(['caregiver']),
  BookingController.getReceivedBookings
);

// PATCH: Caregiver responds to a request (accept/reject)
router.patch(
  '/respond/:bookingId',
  authenticate,
  authorizeRole(['caregiver']),
  BookingController.respondToBooking
);
router.patch(
  '/payment/:bookingId',
  authenticate,
  authorizeRole(['admin', 'carereceiver']),
  BookingController.updatePaymentStatus
);

module.exports = router;
