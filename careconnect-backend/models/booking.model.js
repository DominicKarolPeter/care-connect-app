// Booking model
const pool = require('../config/db');
exports.createBooking = async (
  care_receiver_id,
  caregiver_id,
  date,
  time_slot,
  location,
  charge // ✅ Add this to the parameter list
) => {
  console.log('Inserting into DB:', care_receiver_id, caregiver_id, date, time_slot, location, charge);

  const result = await pool.query(
    `INSERT INTO booking_requests 
     (care_receiver_id, caregiver_id, date, time_slot, location, charge_amount)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, care_receiver_id, caregiver_id, date, time_slot, status, created_at, location, charge_amount`,
    [care_receiver_id, caregiver_id, date, time_slot, location, charge]
  );
  return result.rows[0];
};
exports.getReceivedBookings = async (caregiver_id) => {
  const result = await pool.query(
    `SELECT br.*, u.name AS care_receiver_name
     FROM booking_requests br
     JOIN users u ON br.care_receiver_id = u.id
     WHERE br.caregiver_id = $1
     ORDER BY br.date`,
    [caregiver_id]
  );
  return result.rows;
};

exports.respondToBooking = async (bookingId, newStatus) => {
  const result = await pool.query(
    `UPDATE booking_requests SET status = $1 WHERE id = $2 RETURNING *`,
    [newStatus, bookingId]
  );
  return result.rows[0];
};
exports.getBookingById = async (bookingId) => {
  const result = await pool.query(
    `SELECT * FROM booking_requests WHERE id = $1`,
    [bookingId]
  );
  return result.rows[0];
};
exports.updatePaymentStatus = async (bookingId, status) => {
  const result = await pool.query(
    `UPDATE booking_requests
     SET payment_status = $1
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );
  return result.rows[0];
};
