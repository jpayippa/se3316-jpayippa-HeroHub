const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Verification Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};


// Middleware to authenticate token and check for admin or GrandAdmin role
const authenticateAndAuthorizeAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Check if the user role is admin or GrandAdmin
      if (user.role !== 'admin' && user.role !== 'GrandAdmin') {
          return res.status(403).json({ error: 'Unauthorized access' });
      }

      req.user = user; // Add user information to the request
      next();
  });
};


// Export the  middleware
module.exports = authenticateToken;
module.exports = authenticateAndAuthorizeAdmin;
