const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      throw new Error("Please provide productId");

    const reviews = await Review.findOne({ productId });
    res.status(200).json({
      success: true,
      reviews: reviews.reviews,
      message: "Fetch success"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const { comment, rating } = req.body;

    if (!productId || !userId)
      throw new Error("Please provide all of the data");

    if (!rating)
      throw new Error("Please give a rating");

    if (comment.length >= 50)
      throw new Error("The Review is too long");

    let reviews = await Review.findOne({ productId });
    if (!reviews) {
      reviews = new Review({
        productId,
        reviews: []
      });
    }
    const existingReview = reviews.reviews.find((review) => review.userId.toString() === userId);
    if (existingReview) {
      existingReview.comment = comment;
      existingReview.rating = rating;
      await reviews.save();
      return res.status(200).json({
        success: true,
        reviews: reviews.reviews,
        message: "Review Updated!"
      })
    }

    reviews.reviews.push({ userId, comment, rating });
    await reviews.save();
    res.status(201).json({
      success: true,
      reviews: reviews.reviews,
      message: "Review Added"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { getAllReviews, createReview };