const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Reviews = require("../models/reviews.js");

const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");

const listingController = require("../controllers/review.js");

/* ---------------- JOI VALIDATION ---------------- */
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

/* ---------------- CREATE REVIEW ---------------- */
router.post(
  "/",
  validateReview,
  wrapAsync(listingController.createReview)
);

/* ---------------- DELETE REVIEW ---------------- */
router.delete(
  "/:reviewId",
  wrapAsync(listingController.deleteReview)
);

module.exports = router;