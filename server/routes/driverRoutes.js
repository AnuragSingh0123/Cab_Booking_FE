const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDriverDashboard,
  toggleDriverStatus,
  updateDriverLocation,
} = require("../controllers/driverController");

// GET   /api/driver/dashboard       — driver dashboard data (was: GET /driver/dashboard)
router.get("/dashboard", authMiddleware, getDriverDashboard);

// PATCH /api/driver/status          — toggle online/offline (was: PATCH /driver/toggle-status)
router.patch("/status", authMiddleware, toggleDriverStatus);

// PATCH /api/driver/location/:place — update driver location (was: PATCH /driverLocation/:place)
router.patch("/location/:place", authMiddleware, updateDriverLocation);

module.exports = router;