const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

// Role-Based Authorization Middleware
const authorize = (role) => (req, res, next) => {
  if (!req.user || !req.user.roles[role]) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, authorize };
