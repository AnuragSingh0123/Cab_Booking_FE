const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    enum: ["mini", "sedan", "suv", "premium"],
    lowercase: true,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Driver", driverSchema);