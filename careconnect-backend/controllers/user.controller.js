const admin = require('../config/firebase');
const pool = require('../config/db');

exports.setupUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebase_uid = decodedToken.uid;
    const email = decodedToken.email;
    const { name, role } = req.body;

    // Check if user already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [firebase_uid]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({ message: 'User already exists in DB' });
    }

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, role, firebase_uid)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, firebase_uid`,
      [name, email, role, firebase_uid]
    );

    res.status(201).json({ message: 'User setup complete', user: result.rows[0] });
  } catch (err) {
    console.error(err); // show full error in terminal
    res.status(500).json({ message: 'Setup failed', error: err.message });
  }
};
