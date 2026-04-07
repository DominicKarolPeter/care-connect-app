// Caregiver model
// models/caregiverProfile.model.js
const pool = require('../config/db');

exports.createProfile = async (userId, bio, experience_years, specialties, availability) => {
  const result = await pool.query(
    `INSERT INTO caregiver_profiles (user_id, bio, experience_years, specialties, availability)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, bio, experience_years, specialties, availability]
  );
  return result.rows[0];
};

exports.getProfileByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM caregiver_profiles WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};
exports.updateDocumentUrl = async (caregiverId, fileUrl) => {
  const result = await pool.query(
    `UPDATE caregiver_profiles SET document_url = $1 WHERE user_id = $2 RETURNING *`,
    [fileUrl, caregiverId]
  );
  return result.rows[0];
};
exports.setOnlineStatus = async (user_id, is_online) => {
  const result = await pool.query(
    `UPDATE caregiver_profiles
     SET is_online = $1
     WHERE user_id = $2
     RETURNING *`,
    [is_online, user_id]
  );
  return result.rows[0];
};
const CaregiverProfile = {
  // ...existing methods

  getAllPublicProfiles: async () => {
    const result = await pool.query(
      `SELECT id, full_name, photo_url, skills, rate_per_hour, rating
       FROM caregiver_profiles
       WHERE is_verified = true AND is_online = true`
    );
    return result.rows;
  }
};

module.exports = CaregiverProfile;