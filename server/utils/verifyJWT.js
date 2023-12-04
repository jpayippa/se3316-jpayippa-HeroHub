const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model');

// JWT Verification Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];



  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    console.log(user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token is invalid or expired' });
  }
};





// Export the  middleware
module.exports = authenticateToken;

