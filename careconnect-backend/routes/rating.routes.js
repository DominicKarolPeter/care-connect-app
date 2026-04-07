const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/rating.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');

// POST: Leave a rating
router.post(
  '/',
  authenticate,
  authorizeRole(['carereceiver']),
  RatingController.leaveRating
);

// GET: View all ratings for a caregiver
router.get(
  '/caregiver/:caregiverId',
  RatingController.getRatingsForCaregiver
);

module.exports = router;
