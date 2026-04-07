const Rating = require('../models/rating.model');
const Booking = require('../models/booking.model');

exports.leaveRating = async (req, res) => {
  const careReceiverId = req.localUser.id;
  const { bookingId, rating, comment } = req.body;

  try {
    const booking = await Booking.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'completed')
      return res.status(400).json({ message: 'Can only rate completed bookings' });

    if (booking.care_receiver_id !== careReceiverId)
      return res.status(403).json({ message: 'You can only rate your own bookings' });

    const saved = await Rating.createRating(
      bookingId,
      careReceiverId,
      booking.caregiver_id,
      rating,
      comment
    );

    res.status(201).json({ message: 'Rating submitted', rating: saved });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};

exports.getRatingsForCaregiver = async (req, res) => {
  const caregiverId = req.params.caregiverId;

  try {
    const ratings = await Rating.getRatingsForCaregiver(caregiverId);
    res.json({ ratings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ratings', error: err.message });
  }
};
