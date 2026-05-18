const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/reviewController");

// POST /api/reviews — submit a ride review/feedback (was: POST /user/feedback)
router.post("/", submitFeedback);

module.exports = router;