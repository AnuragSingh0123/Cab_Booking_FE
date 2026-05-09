const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cab_db");
    console.log("Connected to Database");
  } catch (err) {
    console.log("DB Error:", err);
  }
};

module.exports = connectDB;