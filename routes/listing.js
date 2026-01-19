const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Reviews = require("../models/reviews.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");



/* ---------------- JOI VALIDATION ---------------- */

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

/* ---------------- LISTING ROUTES ---------------- */

// INDEX
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// NEW
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));

// SHOW (populate reviews)
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show.ejs", { listing });
}));

// EDIT
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id", wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
}));




module.exports = router;
