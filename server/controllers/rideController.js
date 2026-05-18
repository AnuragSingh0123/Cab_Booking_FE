const Booking = require("../models/booking");
const Driver = require("../models/driver");
const User = require("../models/user");

// POST /api/rides
const bookRide = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      riderId: req.user.id,
    });

    res.status(201).json({
      message: "Ride booked successfully",
      booking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Booking failed",
    });
  }
};

// GET /api/rides  (rider's own bookings)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      riderId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

// GET /api/rides/:id  (public booking + driver details)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    let driver = null;

    if (booking.driverId) {
      const driverDetails = await Driver.findOne({
        userId: booking.driverId,
      });

      const userDetails = await User.findById(
        booking.driverId
      ).select("-password");

      driver = {
        id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        vehicle: driverDetails.vehicleType,
        vehicleNo: driverDetails.vehicleNumber,
        license: driverDetails.licenseNumber,
        available: driverDetails.isAvailable,
        driverCoordinates: driverDetails.driverCoordinates
      };
    }

    res.json({
      booking,
      driver,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error",
    });
  }
};

// PATCH /api/rides/:id  (update booking status — used by both rider cancel and driver accept/start/complete)
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const { status, completedAt } = req.body;

    booking.status = status;

    if (status === "accepted") {
      booking.driverId = req.user.id;
    }

    if (completedAt) {
      booking.completedAt = completedAt;
    }

    await booking.save();

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Update failed",
    });
  }
};

module.exports = {
  bookRide,
  getMyBookings,
  getBookingById,
  updateBooking,
};