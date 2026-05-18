const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  bookRide,
  getMyBookings,
  getBookingById,
  updateBooking,
} = require("../controllers/rideController");

// POST   /api/rides          — book a new ride (was: POST /book-ride)
router.post("/", authMiddleware, bookRide);

// GET    /api/rides          — rider's own booking history (was: GET /my-bookings)
router.get("/", authMiddleware, getMyBookings);

// GET    /api/rides/:id      — public booking + driver details (was: GET /user/booking/:id)
router.get("/:id", getBookingById);

// PATCH  /api/rides/:id      — update booking status (was: PATCH /booking/:id)
router.patch("/:id", authMiddleware, updateBooking);

module.exports = router;