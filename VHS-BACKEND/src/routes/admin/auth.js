const express = require("express");
const MasterAdmin = require("../../controller/admin/auth");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", MasterAdmin.addUser);
router.post("/login", MasterAdmin.loginUser);

// Protected Route Example (Requires JWT)
router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ success: "Access granted to profile", user: req.user });
});

module.exports = router;
