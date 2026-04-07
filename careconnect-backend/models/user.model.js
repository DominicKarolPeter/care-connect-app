// models/user.model.js
const pool = require('../utils/db');

const UserModel = {
  async create({ name, email, role, firebase_uid }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, role, firebase_uid)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, firebase_uid`,
      [name, email, role, firebase_uid]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async findByFirebaseUID(uid) {
    const result = await pool.query(
      `SELECT * FROM users WHERE firebase_uid = $1`,
      [uid]
    );
    return result.rows[0];
  }
};

module.exports = UserModel;
