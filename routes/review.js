const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Reviews = require("../models/reviews.js");

const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");

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
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

/* ---------------- DELETE REVIEW ---------------- */
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${listing._id}`);
  })
);

module.exports = router;
