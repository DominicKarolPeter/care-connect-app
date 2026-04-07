// Role-based access middleware
// middlewares/role.middleware.js
const User = require('../models/user.model');

const authorizeRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    const firebaseUID = req.user.uid;
    const localUser = await User.findByFirebaseUID(firebaseUID);

    if (!localUser) {
      return res.status(403).json({ message: 'User not registered in backend' });
    }

    if (!allowedRoles.includes(localUser.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    req.localUser = localUser; // attach to request for later use
    next();
  };
};

module.exports = authorizeRole;
