const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    pickup: String,
    drop: String,
    distance: Number,
    duration: Number,
    fare: Number,
    gst: Number,
    total: Number,
    vehicle: String,
    pickUpCoordinates: {
      type: [Number],
      required: true,
    },
    dropCoordinates: {
      type: [Number],
      required: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed", "cancelled"],
      default: "requested",
    },
    rejectedDrivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);