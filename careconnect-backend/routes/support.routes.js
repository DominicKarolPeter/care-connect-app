const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const SupportController = require('../controllers/support.controller');

// 📝 Create support ticket (Caregiver or CareReceiver)
router.post(
  '/tickets',
  authenticate,
  authorizeRole(['caregiver', 'carereceiver']),
  SupportController.createTicket
);

// 📄 Admin: View all support tickets
router.get(
  '/tickets',
  authenticate,
  authorizeRole(['admin']),
  SupportController.getAllTickets
);

// 🔄 Admin: Update status (open/pending/resolved)
router.patch(
  '/tickets/:ticketId',
  authenticate,
  authorizeRole(['admin']),
  SupportController.updateTicketStatus
);

module.exports = router; // ✅ This line is crucial
