const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");


/* ---------------- JOI VALIDATION ---------------- */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
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
router.get("/new", isLoggedIn, (req, res) => {
    req.isLoggedIn
    res.render("listings/new.ejs");
});

// CREATE
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!"); // Flash added
    res.redirect("/listings");
}));

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!"); // Error flash
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// EDIT
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// UPDATE
router.put("/:id", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!"); // Flash added
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!"); // Flash added
    res.redirect("/listings");
}));

module.exports = router;

