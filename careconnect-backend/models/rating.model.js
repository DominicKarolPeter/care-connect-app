const pool = require('../config/db');

exports.createRating = async (bookingId, careReceiverId, caregiverId, rating, comment) => {
  const result = await pool.query(
    `INSERT INTO ratings 
     (booking_id, care_receiver_id, caregiver_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [bookingId, careReceiverId, caregiverId, rating, comment]
  );
  return result.rows[0];
};

exports.getRatingsForCaregiver = async (caregiverId) => {
  const result = await pool.query(
    `SELECT rating, comment, created_at 
     FROM ratings 
     WHERE caregiver_id = $1
     ORDER BY created_at DESC`,
    [caregiverId]
  );
  return result.rows;
};
