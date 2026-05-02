const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

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
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "rider"
    });

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup error" });
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
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


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