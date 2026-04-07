const Support = require('../models/support.model');

// ✅ Define the functions
const createTicket = async (req, res) => {
  const user_id = req.localUser.id;
  const role = req.localUser.role;
  const { subject, message } = req.body;

  try {
    const ticket = await Support.createTicket(user_id, role, subject, message);
    res.status(201).json({ message: 'Support ticket created', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create ticket', error: err.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.getAllTickets();
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const ticketId = req.params.ticketId;
  const { status } = req.body;

  try {
    const updated = await Support.updateTicketStatus(ticketId, status);
    res.json({ message: 'Ticket status updated', ticket: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ticket', error: err.message });
  }
};

// ✅ Export them properly
module.exports = {
  createTicket,
  getAllTickets,
  updateTicketStatus
};
