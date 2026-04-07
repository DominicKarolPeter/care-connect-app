const pool = require('../config/db');

exports.createTicket = async (user_id, role, subject, message) => {
  const result = await pool.query(
    `INSERT INTO support_tickets (user_id, role, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, role, subject, message]
  );
  return result.rows[0];
};

exports.getAllTickets = async () => {
  const result = await pool.query(
    `SELECT t.*, u.name, u.email
     FROM support_tickets t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
};

exports.updateTicketStatus = async (ticketId, status) => {
  const result = await pool.query(
    `UPDATE support_tickets
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, ticketId]
  );
  return result.rows[0];
};
