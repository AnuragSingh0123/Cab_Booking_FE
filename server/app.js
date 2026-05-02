const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Driver = require("./models/driver");
const Booking = require("./models/booking");

app.use(cors());
app.use(express.json());

const JWT_SECRET = "super_secret_key";


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cab_db");
    console.log("Connected to Database");
  } catch (err) {
    console.log("DB Error:", err);
  }
};


app.post("/auth/sign-up", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      licenseNumber,
      vehicleType,
      vehicleNumber
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "rider"
    });

    if (role === "driver") {
      await Driver.create({
        userId: user._id,
        licenseNumber,
        vehicleType,
        vehicleNumber
      });
    }

    res.status(201).json({
      message: `${role || "rider"} created successfully`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Signup error"
    });
  }
});

app.post("/auth/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};


app.post("/book-ride", authMiddleware, async (req, res) => {
  console.log("here........");
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
});

app.get("/my-bookings", authMiddleware, async (req, res) => {
  console.log("my-bookings route hit");

  try {
    const bookings = await Booking.find({
      riderId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch bookings"
    });
  }
});

app.patch("/booking-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status, cancelReason, rating, feedback } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        cancelReason,
        rating,
        feedback
      },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Status update failed"
    });
  }
});


app.get("/driver/dashboard", authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findOne({
      userId: req.user.id
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found"
      });
    }

    const availableRide = await Booking.findOne({
      status: "requested",
      driverId: null
    }).sort({ createdAt: 1 });

    const activeRide = await Booking.findOne({
      driverId: req.user.id,
      status: {
        $in: ["accepted", "started"]
      }
    }).sort({ createdAt: -1 });

    const reviews = await Booking.find({
      driverId: req.user.id,
      rating: { $exists: true }
    })
      .sort({ completedAt: -1 })
      .limit(5);

    const completed = await Booking.find({
      driverId: req.user.id,
      status: "completed"
    });

    const stats = {
      trips: completed.length,
      earnings: completed.reduce(
        (sum, ride) => sum + (ride.total || 0),
        0
      ),
      distance: completed.reduce(
        (sum, ride) => sum + (ride.distance || 0),
        0
      ),
      hours: Number(
        (
          completed.reduce(
            (sum, ride) => sum + (ride.duration || 0),
            0
          ) / 60
        ).toFixed(1)
      )
    };

    res.json({
      driver,
      availableRide,
      activeRide,
      reviews,
      stats
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});


app.patch("/driver/toggle-status", authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findOne({
      userId: req.user.id
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found"
      });
    }

    driver.online = !driver.online;

    await driver.save();

    res.json(driver);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});


app.patch("/booking/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const { status, completedAt } = req.body;

    booking.status = status;

    if (status === "accepted") {
      booking.driverId = req.user.id;

      const user = await User.findById(req.user.id);
      const driver = await Driver.findOne({
        userId: req.user.id
      });

      booking.driver = {
        name: user.name,
        vehicle: driver.vehicleType,
        vehicleNo: driver.vehicleNumber,
        rating: driver.rating || 0,
        phone: "9876543210"
      };
    }

    if (completedAt) {
      booking.completedAt = completedAt;
    }

    await booking.save();

    res.json(booking);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Update failed"
    });
  }
});


app.get("/auth/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json(user);
});


app.get("/", (req, res) => {
  res.send("App is running");
});


app.listen(3000, async () => {
  await connectDB();
  console.log("Server running on http://localhost:3000");
});