const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: String,
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
      },
    }
  ]
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;