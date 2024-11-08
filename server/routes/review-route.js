const { Router } = require("express");
const { getAllReviews, createReview } = require("../controllers/review-controller");
const { authMiddleware } = require("../controllers/auth-controller");

const router = Router();

router.get("/get/:productId", getAllReviews);
router.post("/create/:productId", authMiddleware, createReview);

module.exports = router;