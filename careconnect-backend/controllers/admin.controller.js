const pool = require('../config/db');

exports.getAllSessions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        br.id,
        br.date,
        br.time_slot,
        br.status,
        br.location,
        br.charge_amount,
        br.payment_status,
        cr.name AS care_receiver_name,
        cr.email AS care_receiver_email,
        cg.name AS caregiver_name,
        cg.email AS caregiver_email,
        cp.is_approved AS caregiver_approved
      FROM booking_requests br
      JOIN users cr ON br.care_receiver_id = cr.id
      JOIN users cg ON br.caregiver_id = cg.id
      JOIN caregiver_profiles cp ON cg.id = cp.user_id
      ORDER BY br.created_at DESC
    `);

    // Group by booking status
    const grouped = {};
    for (const row of result.rows) {
      const key = row.status;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        booking_id: row.id,
        date: row.date,
        time_slot: row.time_slot,
        location: row.location,
        charge_amount: row.charge_amount,
        payment_status: row.payment_status,
        care_receiver: {
          name: row.care_receiver_name,
          email: row.care_receiver_email
        },
        caregiver: {
          name: row.caregiver_name,
          email: row.caregiver_email,
          approved: row.caregiver_approved
        }
      });
    }

    res.json({ sessions: grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch sessions', error: err.message });
  }
};
