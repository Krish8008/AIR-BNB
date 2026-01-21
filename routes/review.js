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
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!"); // Success Flash
    res.redirect(`/listings/${listing._id}`);
  })
);

/* ---------------- DELETE REVIEW ---------------- */
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review reference from Listing
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } }
    );

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Delete the actual review document
    await Reviews.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!"); // Success Flash
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;