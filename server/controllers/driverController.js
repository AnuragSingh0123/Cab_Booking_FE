const Booking = require("../models/booking");
const Driver = require("../models/driver");
const User = require("../models/user");
const Review = require("../models/review");

// GET /api/driver/dashboard
const getDriverDashboard = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      userId: req.user.id,
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    const availableRide = await Booking.findOne({
      status: "requested",
      driverId: null,
    }).sort({ createdAt: 1 });

    const activeRide = await Booking.findOne({
      driverId: req.user.id,
      status: {
        $in: ["accepted", "started"],
      },
    }).sort({ createdAt: -1 });

    const reviews = await Review.find({
      driverId: req.user.id,
    })
      .populate("bookingId", "pickup drop total")
      .sort({ createdAt: -1 })
      .limit(5);

    const completed = await Booking.find({
      driverId: req.user.id,
      status: "completed",
    });

    const stats = {
      trips: completed.length,
      earnings: completed.reduce((sum, ride) => sum + (ride.total || 0), 0),
      distance: completed.reduce((sum, ride) => sum + (ride.distance || 0), 0),
      hours: Number(
        (
          completed.reduce((sum, ride) => sum + (ride.duration || 0), 0) / 60
        ).toFixed(1)
      ),
    };

    res.json({
      driver,
      availableRide,
      activeRide,
      reviews,
      stats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// PATCH /api/driver/status
const toggleDriverStatus = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      userId: req.user.id,
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    driver.online = !driver.online;

    await driver.save();

    res.json(driver);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// PATCH /api/driver/location/:place
const updateDriverLocation = async (req, res) => {
  try {
    console.log("hello");

    const user = await User.findById(req.user.id);
    const userId = user._id;
    console.log("userId=", userId);

    const driverLocation = req.params.place;

    if (driverLocation) {
      const updateLocation = await Driver.findOneAndUpdate(
        { userId: userId },
        { $set: { driverLocation: driverLocation } },
        { returnDocument: "after" }
      );

      return res.status(200).json(updateLocation);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDriverDashboard,
  toggleDriverStatus,
  updateDriverLocation,
};