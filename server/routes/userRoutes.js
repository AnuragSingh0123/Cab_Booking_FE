const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, editProfile } = require("../controllers/userController");


router.get("/profile", authMiddleware, getProfile);
router.patch("/editProfile", authMiddleware, editProfile);

module.exports = router;