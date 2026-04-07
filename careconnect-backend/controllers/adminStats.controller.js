const pool = require('../config/db');

exports.getAdminStats = async (req, res) => {
  try {
    const [users, caregivers, receivers, approved, online] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'caregiver'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'carereceiver'`),
      pool.query(`SELECT COUNT(*) FROM caregiver_profiles WHERE is_approved = true`),
      pool.query(`SELECT COUNT(*) FROM caregiver_profiles WHERE is_online = true`)
    ]);

    const [bookings, completed, pending, inProgress] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM booking_requests`),
      pool.query(`SELECT COUNT(*) FROM booking_requests WHERE status = 'completed'`),
      pool.query(`SELECT COUNT(*) FROM booking_requests WHERE status = 'pending'`),
      pool.query(`SELECT COUNT(*) FROM booking_requests WHERE status = 'in_progress'`)
    ]);

    const [revenue, unpaid] = await Promise.all([
      pool.query(`SELECT SUM(charge_amount) FROM booking_requests WHERE payment_status = 'paid'`),
      pool.query(`SELECT COUNT(*) FROM booking_requests WHERE payment_status != 'paid'`)
    ]);

    const [ratingAvg, ratingCount] = await Promise.all([
      pool.query(`SELECT AVG(rating) FROM ratings`),
      pool.query(`SELECT COUNT(*) FROM ratings`)
    ]);

    const [openTickets, resolvedTickets] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status = 'open'`),
      pool.query(`SELECT COUNT(*) FROM support_tickets WHERE status = 'resolved'`)
    ]);

    res.json({
      users: {
        total: parseInt(users.rows[0].count),
        caregivers: parseInt(caregivers.rows[0].count),
        carereceivers: parseInt(receivers.rows[0].count),
        approved_caregivers: parseInt(approved.rows[0].count),
        online_caregivers: parseInt(online.rows[0].count),
      },
      bookings: {
        total: parseInt(bookings.rows[0].count),
        completed: parseInt(completed.rows[0].count),
        pending: parseInt(pending.rows[0].count),
        in_progress: parseInt(inProgress.rows[0].count),
      },
      payments: {
        total_revenue: parseInt(revenue.rows[0].sum || 0),
        pending_payments: parseInt(unpaid.rows[0].count),
      },
      ratings: {
        average_rating: parseFloat(ratingAvg.rows[0].avg || 0).toFixed(1),
        total_reviews: parseInt(ratingCount.rows[0].count),
      },
      support: {
        open_tickets: parseInt(openTickets.rows[0].count),
        resolved_tickets: parseInt(resolvedTickets.rows[0].count),
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin stats', error: err.message });
  }
};
