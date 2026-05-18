const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

// GET /api/users/profile — authenticated user profile + stats (was: GET /profile)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;