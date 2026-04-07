// Booking controller
const Booking = require('../models/booking.model');
const pool = require('../config/db'); 
const validTransitions = {
  pending: ['approved', 'rejected'],
  approved: ['in_progress'],
  in_progress: ['completed'],
};
exports.createBooking = async (req, res) => {
  const { caregiver_id, date, time_slot, location } = req.body;
  const care_receiver_id = req.localUser.id;

  try {
    // 1️⃣ Check if caregiver is approved and get experience
    const caregiverResult = await pool.query(
      `SELECT is_approved, experience_years FROM caregiver_profiles WHERE user_id = $1`,
      [caregiver_id]
    );

    if (caregiverResult.rows.length === 0) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    const caregiver = caregiverResult.rows[0];

    if (!caregiver.is_approved) {
      return res.status(403).json({ message: 'Caregiver is not approved by admin' });
    }

    // 2️⃣ Calculate charge using experience and time_slot
    const chargeUtil = require('../utils/chargeCalculator');
    const charge = chargeUtil.calculateCharges(caregiver.experience_years, time_slot);

    // 3️⃣ Create the booking (pass charge to model)
    const booking = await Booking.createBooking(
      care_receiver_id,
      caregiver_id,
      date,
      time_slot,
      location,
      charge // ✅ Pass the calculated charge
    );

    res.status(201).json({ message: 'Booking request sent', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

exports.getReceivedBookings = async (req, res) => {
  const caregiver_id = req.localUser.id;


  try {
    const bookings = await Booking.getReceivedBookings(caregiver_id);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

exports.respondToBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  const { status: newStatus } = req.body;

  try {
    // Get current status
    const current = await Booking.getBookingById(bookingId);
    if (!current) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const currentStatus = current.status;

    // Check valid transition
    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        message: `Invalid status transition from '${currentStatus}' to '${newStatus}'`
      });
    }

    // Update status
    const updated = await Booking.respondToBooking(bookingId, newStatus);
    res.json({ message: 'Booking status updated', booking: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const updated = await Booking.updatePaymentStatus(bookingId, status);
    res.json({ message: 'Payment status updated', booking: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment', error: err.message });
  }
};
