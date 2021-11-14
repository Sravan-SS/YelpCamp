const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

// create
router.post("/", isLoggedin, validateReview, catchAsync(reviews.createReview));

// delete
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
