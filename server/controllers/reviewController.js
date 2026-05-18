const Review = require("../models/review");

// POST /api/reviews
const submitFeedback = async (req, res) => {
  try {
    const { driverId, rating, feedback, bookingId } = req.body;

    const review = await Review.create({
      bookingId,
      driverId,
      rating,
      feedback,
    });

    res.status(201).json({
      message: "Feedback saved",
      review,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  submitFeedback,
};