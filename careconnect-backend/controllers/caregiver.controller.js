const CaregiverProfile = require('../models/caregiverProfile.model');
const Caregiver = require('../models/caregiverProfile.model');
const pool = require('../config/db');

exports.updateLocation = async (req, res) => {
  const userId = req.localUser.id;
  const { latitude, longitude } = req.body;

  try {
    console.log('🔁 Incoming location update:', latitude, longitude);

    const result = await pool.query(
  `UPDATE caregiver_profiles 
   SET current_latitude = $1, current_longitude = $2 
   WHERE user_id = $3 
   RETURNING current_latitude, current_longitude`,
  [latitude, longitude, userId]
);
;

    res.json({ message: 'Location updated', location: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};
exports.createProfile = async (req, res) => {
  const userId = req.localUser.id; // from auth middleware
  const { bio, experience_years, specialties, availability } = req.body;

  try {
    const profile = await CaregiverProfile.createProfile(
      userId, bio, experience_years, specialties, availability
    );
    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.localUser.id;

  try {
    const profile = await CaregiverProfile.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
exports.setOnlineStatus = async (req, res) => {
  const user_id = req.localUser.id;
  const { is_online } = req.body;

  try {
    const updated = await Caregiver.setOnlineStatus(user_id, is_online);
    res.json({ message: 'Online status updated', caregiver: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

exports.getEarnings = async (req, res) => {
  const caregiver_id = req.localUser.id;

  try {
    const result = await pool.query(
      `SELECT SUM(charge_amount) AS total_earnings
       FROM booking_requests
       WHERE caregiver_id = $1
         AND status = 'completed'
         AND payment_status = 'paid'`,
      [caregiver_id]
    );

    const total = result.rows[0].total_earnings || 0;
    res.json({ total_earnings: parseInt(total) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings', error: err.message });
  }
};
exports.getCaregiverLocation = async (req, res) => {
  const caregiverId = req.params.caregiverId;

  try {
    const result = await pool.query(
      `SELECT current_latitude, current_longitude 
       FROM caregiver_profiles 
       WHERE user_id = $1`,
      [caregiverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Caregiver not found or location unavailable' });
    }

    res.json({ location: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve caregiver location', error: err.message });
  }
};
// Fetch all caregivers (for customer view)
exports.getAllCaregivers = async (req, res) => {
  try {
    const caregivers = await CaregiverProfile.getAllPublicProfiles(); // Create a method in your model
    res.status(200).json(caregivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching caregivers', error: err.message });
  }
};
