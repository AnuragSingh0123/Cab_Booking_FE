const Booking = require("../models/booking");
const Driver = require("../models/driver");
const User = require("../models/user");

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    console.log("heello");

    const user = await User.findById(req.user.id);
    const id = user._id;
    const role = user.role;

    let bookingData = [];
    let driverLocation = null;

    if (role === "rider") {
      bookingData = await Booking.find({ riderId: id });
    } else if (role === "driver") {
      bookingData = await Booking.find({ driverId: id });
      driverData = await Driver.findOne({ userId: id });
      driverLocation = driverData.driverLocation;
      console.log("data=  ", driverData);
    }

    const totalRides = bookingData.length;

    const distanceTravelled = bookingData.reduce(
      (sum, ride) => sum + ride.distance,
      0
    );

    const totalSpent = bookingData.reduce((sum, ride) => sum + ride.total, 0);

    res.json({
      totalRides,
      distanceTravelled,
      totalSpent,
      driverLocation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
};